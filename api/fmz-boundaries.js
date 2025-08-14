// File: api/fmz-boundaries.js
// This file contains simplified GeoJSON data for all 20 of Ontario's Fisheries Management Zones.
// For a real-world application, this would be a much larger and more detailed file.
// Coordinates are in [longitude, latitude] format.

export const fmzBoundaries = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": { "zone": "FMZ 1" },
      "geometry": { "type": "Polygon", "coordinates": [[[-95.1, 56.8], [-89.0, 56.8], [-89.0, 54.0], [-95.1, 54.0], [-95.1, 56.8]]] }
    },
    {
      "type": "Feature",
      "properties": { "zone": "FMZ 2" },
      "geometry": { "type": "Polygon", "coordinates": [[[-95.1, 54.0], [-89.0, 54.0], [-89.0, 51.0], [-95.1, 51.0], [-95.1, 54.0]]] }
    },
    {
      "type": "Feature",
      "properties": { "zone": "FMZ 3" },
      "geometry": { "type": "Polygon", "coordinates": [[[-89.0, 56.8], [-84.0, 56.8], [-84.0, 51.0], [-89.0, 51.0], [-89.0, 56.8]]] }
    },
    {
      "type": "Feature",
      "properties": { "zone": "FMZ 4" },
      "geometry": { "type": "Polygon", "coordinates": [[[-95.1, 51.0], [-91.0, 51.0], [-91.0, 49.5], [-95.1, 49.5], [-95.1, 51.0]]] }
    },
    {
      "type": "Feature",
      "properties": { "zone": "FMZ 5" },
      "geometry": { "type": "Polygon", "coordinates": [[[-95.1, 49.5], [-91.0, 49.5], [-91.0, 48.0], [-95.1, 48.0], [-95.1, 49.5]]] }
    },
    {
      "type": "Feature",
      "properties": { "zone": "FMZ 6" },
      "geometry": { "type": "Polygon", "coordinates": [[[-91.0, 51.0], [-88.0, 51.0], [-88.0, 48.0], [-91.0, 48.0], [-91.0, 51.0]]] }
    },
    {
      "type": "Feature",
      "properties": { "zone": "FMZ 7" },
      "geometry": { "type": "Polygon", "coordinates": [[[-88.0, 51.0], [-84.5, 51.0], [-84.5, 48.0], [-88.0, 48.0], [-88.0, 51.0]]] }
    },
    {
      "type": "Feature",
      "properties": { "zone": "FMZ 8" },
      "geometry": { "type": "Polygon", "coordinates": [[[-85.0, 51.0], [-79.5, 51.0], [-79.5, 47.0], [-85.0, 47.0], [-85.0, 51.0]]] }
    },
    {
      "type": "Feature",
      "properties": { "zone": "FMZ 9" },
      "geometry": { "type": "Polygon", "coordinates": [[[-92.0, 48.0], [-84.5, 48.0], [-84.5, 46.5], [-92.0, 46.5], [-92.0, 48.0]]] }
    },
    {
      "type": "Feature",
      "properties": { "zone": "FMZ 10" },
      "geometry": { "type": "Polygon", "coordinates": [[[-84.5, 48.5], [-80.0, 48.5], [-80.0, 46.0], [-84.5, 46.0], [-84.5, 48.5]]] }
    },
    {
      "type": "Feature",
      "properties": { "zone": "FMZ 11" },
      "geometry": { "type": "Polygon", "coordinates": [[[-81.0, 47.5], [-79.0, 47.5], [-79.0, 46.0], [-81.0, 46.0], [-81.0, 47.5]]] }
    },
    {
      "type": "Feature",
      "properties": { "zone": "FMZ 12" },
      "geometry": { "type": "Polygon", "coordinates": [[[-79.5, 47.5], [-74.5, 47.5], [-74.5, 45.0], [-79.5, 45.0], [-79.5, 47.5]]] }
    },
    {
      "type": "Feature",
      "properties": { "zone": "FMZ 13" },
      "geometry": { "type": "Polygon", "coordinates": [[[-84.0, 46.0], [-82.0, 46.0], [-82.0, 44.0], [-84.0, 44.0], [-84.0, 46.0]]] }
    },
    {
      "type": "Feature",
      "properties": { "zone": "FMZ 14" },
      "geometry": { "type": "Polygon", "coordinates": [[[-82.0, 46.0], [-80.0, 46.0], [-80.0, 45.0], [-82.0, 45.0], [-82.0, 46.0]]] }
    },
    {
      "type": "Feature",
      "properties": { "zone": "FMZ 15" },
      "geometry": { "type": "Polygon", "coordinates": [[[-80.0, 46.5], [-77.5, 46.5], [-77.5, 45.0], [-80.0, 45.0], [-80.0, 46.5]]] }
    },
    {
      "type": "Feature",
      "properties": { "zone": "FMZ 16" },
      "geometry": { "type": "Polygon", "coordinates": [[[-82.0, 45.0], [-79.0, 45.0], [-79.0, 42.5], [-82.0, 42.5], [-82.0, 45.0]]] }
    },
    {
      "type": "Feature",
      "properties": { "zone": "FMZ 17" },
      "geometry": { "type": "Polygon", "coordinates": [[[-79.0, 44.5], [-77.5, 44.5], [-77.5, 43.8], [-79.0, 43.8], [-79.0, 44.5]]] }
    },
    {
      "type": "Feature",
      "properties": { "zone": "FMZ 18" },
      "geometry": { "type": "Polygon", "coordinates": [[[-77.5, 45.5], [-74.5, 45.5], [-74.5, 44.0], [-77.5, 44.0], [-77.5, 45.5]]] }
    },
    {
      "type": "Feature",
      "properties": { "zone": "FMZ 19" },
      "geometry": { "type": "Polygon", "coordinates": [[[-83.5, 43.0], [-79.0, 43.0], [-79.0, 41.5], [-83.5, 41.5], [-83.5, 43.0]]] }
    },
    {
      "type": "Feature",
      "properties": { "zone": "FMZ 20" },
      "geometry": { "type": "Polygon", "coordinates": [[[-79.5, 44.0], [-76.0, 44.0], [-76.0, 43.0], [-79.5, 43.0], [-79.5, 44.0]]] }
    }
  ]
};
