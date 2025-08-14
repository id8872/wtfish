// File: api/get-zone-summary.js
// This function returns all regulations for a given FMZ and checks their season status.

import { regulations } from './regulations.js';
import { isSeasonOpen } from './utils.js'; // Import the shared function

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { fmz } = request.body;
        if (!fmz) {
            return response.status(400).json({ error: 'FMZ is required.' });
        }

        const zoneRegs = regulations[fmz];
        if (!zoneRegs) {
            return response.status(404).json({ error: 'Regulations not found for the specified zone.' });
        }

        const summary = Object.entries(zoneRegs).map(([species, details]) => {
            return {
                species: species,
                season: details.season,
                isOutOfSeason: !isSeasonOpen(details.season)
            };
        });

        response.status(200).json(summary);

    } catch (error) {
        response.status(500).json({ error: error.message });
    }
}
