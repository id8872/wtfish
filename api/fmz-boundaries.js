// File: api/fmz-boundaries.js
// This file contains simplified GeoJSON data for Ontario's Fisheries Management Zones.
// For a real-world application, this would be a much larger and more detailed file.
// Coordinates are in [longitude, latitude] format.

export const fmzBoundaries = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": { "zone": "FMZ 16" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [-80.0, 44.2],
            [-78.5, 44.2],
            [-78.5, 45.0],
            [-80.0, 45.0],
            [-80.0, 44.2]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": { "zone": "FMZ 17" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [-78.5, 44.0],
            [-77.5, 44.0],
            [-77.5, 45.0],
            [-78.5, 45.0],
            [-78.5, 44.0]
          ]
        ]
      }
    }
    // In a full version, all 20 zones would be listed here.
  ]
};
