// File: api/identify.js
// This is the main serverless function. It identifies the fish and checks all regulations.

import { regulations } from './regulations.js';
import formidable from 'formidable';
import fs from 'fs';
import { isSeasonOpen } from './utils.js'; // Import the shared function

// --- Vercel Configuration ---
export const config = {
    api: {
        bodyParser: false,
    },
};

// --- Main Handler ---
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

    const zoneRegs = regulations[fmz];
    const possibleSpecies = zoneRegs ? Object.keys(zoneRegs).join(', ') : 'common Ontario sport fish';
    
    // --- UPDATED PROMPT ---
    // This prompt gives the AI clearer instructions for both cases (in-zone and out-of-zone fish).
    const identifyPrompt = `Identify the fish in the image. First, check if it matches any of these common Ontario species: ${possibleSpecies}. If it's a match, respond with only its common name. If it's not a match, identify the fish anyway and respond with only its common name. Do not add any explanatory text.`;
    
    const payload = { contents: [{ parts: [{ text: identifyPrompt }, { inlineData: { mimeType: "image/jpeg", data: imageData } }] }] };
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

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
    let identifiedSpecies = result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!identifiedSpecies) {
        return response.status(500).json({ error: 'Could not identify the fish from the image.' });
    }
    identifiedSpecies = identifiedSpecies.replace(/^the fish in the image is a /i, '').replace(/\.$/, '');

    let speciesRegs = null, isOutOfSeason = false, isCatchAndRelease = false, hasSizeLimit = false, isNotListedInZone = false, additionalDetails = null;
    if (zoneRegs) {
        const regKey = Object.keys(zoneRegs).find(key => identifiedSpecies.toLowerCase().includes(key.toLowerCase()));
        if (regKey) {
            speciesRegs = zoneRegs[regKey];
            isOutOfSeason = !isSeasonOpen(speciesRegs.season);
            const sportLimitText = speciesRegs.limits.Sport.toLowerCase();
            const conservationLimitText = speciesRegs.limits.Conservation.toLowerCase();
            if (conservationLimitText === 'c-0') isCatchAndRelease = true;
            const sizeKeywords = ['cm', '>', '<', 'between'];
            if (sizeKeywords.some(key => sportLimitText.includes(key) || conservationLimitText.includes(key))) hasSizeLimit = true;
        } else {
            isNotListedInZone = true;
            const detailsPrompt = `Provide a concise, one-sentence description for the fish named "${identifiedSpecies}". Start the sentence with the fish name, include its scientific name in parentheses if common, and describe its typical habitat or location. Example: "Butterfish, also known as Atlantic butterfish (Peprilus triacanthus), are small, silvery, flat-bodied fish found in the Atlantic Ocean."`;
            const detailsPayload = { contents: [{ parts: [{ text: detailsPrompt }] }] };
            const detailsResponse = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(detailsPayload) });
            if (detailsResponse.ok) {
                const detailsResult = await detailsResponse.json();
                additionalDetails = detailsResult?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
            }
        }
    }
    
    response.status(200).json({ species: identifiedSpecies, regulations: speciesRegs, isOutOfSeason, isCatchAndRelease, hasSizeLimit, isNotListedInZone, additionalDetails });

  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}
