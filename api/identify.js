// File: api/identify.js
// This function now handles multipart/form-data uploads.

import { regulations } from './regulations.js';
import formidable from 'formidable';
import fs from 'fs';

// --- Vercel Configuration ---
// Disable the default body parser to handle the multipart/form-data stream ourselves.
export const config = {
    api: {
        bodyParser: false,
    },
};

// --- Helper function to check if the current date is within the fishing season ---
function isSeasonOpen(seasonString) {
    if (!seasonString || seasonString.toLowerCase().includes('open all year')) return true;
    if (seasonString.toLowerCase().includes('closed all year')) return false;
    const now = new Date();
    const today = { month: now.getMonth() + 1, day: now.getDate() };
    const parseDate = (dateStr) => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const simplifiedStr = dateStr.trim().replace(/first sat in|second sat in|third sat in|fourth sat in|fri before fourth sat in|fri before third sat in/i, '').trim();
        const parts = simplifiedStr.replace(/,.*/, '').split(' ');
        let monthIndex = monthNames.findIndex(m => parts[0].startsWith(m));
        if (monthIndex === -1) return null;
        const day = parts[1] ? parseInt(parts[1], 10) : 1;
        return { month: monthIndex + 1, day: day };
    };
    const seasons = seasonString.split('&');
    for (const season of seasons) {
        const dates = season.split('to');
        if (dates.length !== 2) continue;
        const start = parseDate(dates[0]);
        const end = parseDate(dates[1]);
        if (!start || !end) continue;
        if (start.month <= end.month) {
            if ((today.month > start.month || (today.month === start.month && today.day >= start.day)) && (today.month < end.month || (today.month === end.month && today.day <= end.day))) return true;
        } else {
            if ((today.month > start.month || (today.month === start.month && today.day >= start.day)) || (today.month < end.month || (today.month === end.month && today.day <= end.day))) return true;
        }
    }
    return false;
}

// --- Main Handler ---
export default async function handler(request, response) {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        return response.status(500).json({ error: 'API key is not configured.' });
    }

    // --- New: Parse the multipart form data ---
    const form = formidable({
        maxFileSize: 4 * 1024 * 1024, // 4MB limit
    });

    try {
        const [fields, files] = await form.parse(request);
        
        const fmz = fields.fmz?.[0];
        const photo = files.photo?.[0];

        if (!fmz || !photo) {
            return response.status(400).json({ error: 'Missing form data (fmz or photo).' });
        }
        
        // --- Convert the uploaded file to Base64 for the Gemini API ---
        const imageData = fs.readFileSync(photo.filepath).toString('base64');

        const zoneRegs = regulations[fmz];
        const possibleSpecies = zoneRegs ? Object.keys(zoneRegs).join(', ') : 'common Ontario sport fish';
        const identifyPrompt = `From the following list of fish found in Ontario (${possibleSpecies}), identify the species of fish in this image. Respond with only the common name of the fish. Do not add any other text.`;
        
        const payload = { contents: [{ parts: [{ text: identifyPrompt }, { inlineData: { mimeType: photo.mimetype, data: imageData } }] }] };
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

        // ... (The rest of the regulation checking logic remains the same)
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
        if (error.message.includes('maxFileSize exceeded')) {
            return response.status(413).json({ error: 'The uploaded image is too large. Please use an image under 4MB.' });
        }
        response.status(500).json({ error: error.message });
    }
}
