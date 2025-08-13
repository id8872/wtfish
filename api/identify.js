// File: api/identify.js

export default async function handler(request, response) {
  // We only accept POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { imageData } = request.body;
    const apiKey = process.env.GOOGLE_API_KEY; // Get the key securely from Vercel

    if (!apiKey) {
      return response.status(500).json({ error: 'API key is not configured.' });
    }

    if (!imageData) {
        return response.status(400).json({ error: 'No image data provided.' });
    }

    const prompt = "Identify the species of fish in this image. This fish was likely caught in Ontario, Canada. Respond with only the common name of the fish.";

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
        // Return the actual error from Google's API for better debugging
        return response.status(apiResponse.status).json({ error: `Google API Error: ${errorBody}` });
    }

    const result = await apiResponse.json();
    
    // Send the result back to the frontend
    response.status(200).json(result);

  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}
