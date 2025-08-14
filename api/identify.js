// File: api/identify.js
// This is the main serverless function. It identifies the fish and looks up regulations.

// Import the regulations data from our new data file
import { regulations } from './regulations.js';

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

    // --- Step 1: Identify the fish species using the AI ---
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

    // --- Step 2: Look up the regulations from our internal data table ---
    const zoneRegs = regulations[fmz];
    let speciesRegs = null;

    if (zoneRegs) {
        // Find a matching key in our regulations data. This handles variations like "Largemouth Bass" vs "Bass".
        const regKey = Object.keys(zoneRegs).find(key => identifiedSpecies.includes(key));
        if (regKey) {
            speciesRegs = zoneRegs[regKey];
        }
    }
    
    // --- Step 3: Send both pieces of information back to the frontend ---
    response.status(200).json({
        species: identifiedSpecies,
        regulations: speciesRegs 
    });

  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}
