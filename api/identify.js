// File: api/identify.js
// This is the main serverless function. It identifies the fish and checks the season regulations.

import { regulations } from './regulations.js';

// --- Helper function to check if the current date is within the fishing season ---
function isSeasonOpen(seasonString) {
    if (!seasonString || seasonString.toLowerCase() === 'open all year') {
        return true;
    }
    if (seasonString.toLowerCase() === 'closed all year') {
        return false;
    }

    // Get the current date in a simple format, without the year.
    // We add 1 to getMonth() because it's zero-based (0=Jan, 1=Feb, etc.)
    const now = new Date();
    const today = { month: now.getMonth() + 1, day: now.getDate() };

    // This function converts a "Month Day" string into a comparable object.
    const parseDate = (dateStr) => {
        const parts = dateStr.trim().split(' ');
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return {
            month: monthNames.indexOf(parts[0]) + 1,
            day: parseInt(parts[1], 10)
        };
    };
    
    // The regulations have two main formats: "Jan 1 to Sep 30" or "Jan 1 to Mar 15 & second Sat in May to Dec 31"
    const seasons = seasonString.split('&');

    for (const season of seasons) {
        const dates = season.split('to');
        if (dates.length !== 2) continue;

        const start = parseDate(dates[0]);
        const end = parseDate(dates[1]);

        // Case 1: Season does not cross the new year (e.g., Apr 1 to Sep 30)
        if (start.month <= end.month) {
            if ((today.month > start.month || (today.month === start.month && today.day >= start.day)) &&
                (today.month < end.month || (today.month === end.month && today.day <= end.day))) {
                return true; // We are within a valid season part
            }
        } 
        // Case 2: Season crosses the new year (e.g., Oct 1 to Mar 15)
        else {
            if ((today.month > start.month || (today.month === start.month && today.day >= start.day)) ||
                (today.month < end.month || (today.month === end.month && today.day <= end.day))) {
                return true; // We are within a valid season part
            }
        }
    }

    return false; // If we loop through all parts and none match, the season is closed.
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

    if (zoneRegs) {
        const regKey = Object.keys(zoneRegs).find(key => identifiedSpecies.toLowerCase().includes(key.toLowerCase()));
        if (regKey) {
            speciesRegs = zoneRegs[regKey];
            // Check if the season is open for this fish
            isOutOfSeason = !isSeasonOpen(speciesRegs.season);
        }
    }
    
    response.status(200).json({
        species: identifiedSpecies,
        regulations: speciesRegs,
        isOutOfSeason: isOutOfSeason // Send the new flag to the frontend
    });

  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}
