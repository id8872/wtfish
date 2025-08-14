// File: api/identify.js
// This is the main serverless function. It identifies the fish and checks all regulations.

import { regulations } from './regulations.js';

// --- Helper function to check if the current date is within the fishing season ---
function isSeasonOpen(seasonString) {
    if (!seasonString || seasonString.toLowerCase().includes('open all year')) {
        return true;
    }
    if (seasonString.toLowerCase().includes('closed all year')) {
        return false;
    }

    const now = new Date();
    const today = { month: now.getMonth() + 1, day: now.getDate() };

    const parseDate = (dateStr) => {
        const parts = dateStr.trim().replace(/,.*/, '').split(' ');
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let monthIndex = monthNames.findIndex(m => parts[0].startsWith(m));
        if (monthIndex === -1) return null; // Handle cases where month is not found
        return {
            month: monthIndex + 1,
            day: parseInt(parts[1], 10)
        };
    };
    
    // This logic is simplified and may not catch all complex date rules like "third Saturday in May".
    const simplifiedSeason = seasonString.replace(/(\w+\s\w+\s\w+\s\w+)/g, '');
    const seasons = simplifiedSeason.split('&');

    for (const season of seasons) {
        const dates = season.split('to');
        if (dates.length !== 2) continue;

        const start = parseDate(dates[0]);
        const end = parseDate(dates[1]);

        if (!start || !end) continue;

        if (start.month <= end.month) {
            if ((today.month > start.month || (today.month === start.month && today.day >= start.day)) &&
                (today.month < end.month || (today.month === end.month && today.day <= end.day))) {
                return true;
            }
        } else { // Season crosses the new year
            if ((today.month > start.month || (today.month === start.month && today.day >= start.day)) ||
                (today.month < end.month || (today.month === end.month && today.day <= end.day))) {
                return true;
            }
        }
    }

    return false;
}


export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { imageData, fmz } = request.body;
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return response.status(500).json({ error: 'API key is not configured.' });
    }
    if (!imageData || !fmz) {
        return response.status(400).json({ error: 'Missing image data or FMZ.' });
    }

    const prompt = "Identify the species of fish in this image. This fish was likely caught in Ontario, Canada. Respond with only the common name of the fish, for example: 'Largemouth Bass' or 'Northern Pike'.";
    const payload = {
      contents: [{
        parts: [
          { text: prompt },
          { inlineData: { mimeType: "image/jpeg", data: imageData } }
        ]
      }]
    };
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!apiResponse.ok) {
        const errorBody = await apiResponse.text();
        return response.status(apiResponse.status).json({ error: `Google API Error: ${errorBody}` });
    }

    const result = await apiResponse.json();
    const identifiedSpecies = result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!identifiedSpecies) {
        return response.status(500).json({ error: 'Could not identify the fish from the image.' });
    }

    const zoneRegs = regulations[fmz];
    let speciesRegs = null;
    let isOutOfSeason = false;
    let isCatchAndRelease = false;
    let hasSizeLimit = false;

    if (zoneRegs) {
        const regKey = Object.keys(zoneRegs).find(key => identifiedSpecies.toLowerCase().includes(key.toLowerCase()));
        if (regKey) {
            speciesRegs = zoneRegs[regKey];
            isOutOfSeason = !isSeasonOpen(speciesRegs.season);
            
            const sportLimitText = speciesRegs.limits.Sport.toLowerCase();
            const conservationLimitText = speciesRegs.limits.Conservation.toLowerCase();

            if (conservationLimitText === 'c-0') {
                isCatchAndRelease = true;
            }
            
            // Check for keywords indicating a size limit
            const sizeKeywords = ['cm', '>', '<', 'between'];
            if (sizeKeywords.some(key => sportLimitText.includes(key) || conservationLimitText.includes(key))) {
                hasSizeLimit = true;
            }
        }
    }
    
    response.status(200).json({
        species: identifiedSpecies,
        regulations: speciesRegs,
        isOutOfSeason: isOutOfSeason,
        isCatchAndRelease: isCatchAndRelease,
        hasSizeLimit: hasSizeLimit // Send the new flag
    });

  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}
