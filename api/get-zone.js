// File: api/get-zone.js
// This serverless function determines which FMZ a given GPS coordinate is in.

import { fmzBoundaries } from './fmz-boundaries.js';

// This is a standard "point in polygon" algorithm.
// It checks if a GPS point is inside a geographic area.
function isPointInPolygon(point, polygon) {
  const [x, y] = point;
  let isInside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    const intersect = ((yi > y) !== (yj > y))
      && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

    if (intersect) {
      isInside = !isInside;
    }
  }
  return isInside;
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { latitude, longitude } = request.body;
    if (!latitude || !longitude) {
      return response.status(400).json({ error: 'Latitude and longitude are required.' });
    }

    const userPoint = [longitude, latitude];
    let foundZone = null;

    // Loop through our map data to find a match.
    for (const feature of fmzBoundaries.features) {
      const polygon = feature.geometry.coordinates[0];
      if (isPointInPolygon(userPoint, polygon)) {
        foundZone = feature.properties.zone;
        break; // Stop once we find the first match
      }
    }

    if (foundZone) {
      response.status(200).json({ zone: foundZone });
    } else {
      response.status(200).json({ zone: null, message: "Could not determine zone from your location. Please select manually." });
    }

  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}
