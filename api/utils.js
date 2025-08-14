// File: api/utils.js
// This file contains shared helper functions for the API.

export function isSeasonOpen(seasonString) {
    if (!seasonString || seasonString.toLowerCase().includes('open all year')) {
        return true;
    }
    if (seasonString.toLowerCase().includes('closed all year')) {
        return false;
    }

    const now = new Date();
    const today = { month: now.getMonth() + 1, day: now.getDate() };

    const parseDate = (dateStr) => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        const simplifiedStr = dateStr.trim()
            .replace(/first sat in/i, '')
            .replace(/second sat in/i, '')
            .replace(/third sat in/i, '')
            .replace(/fourth sat in/i, '')
            .replace(/fri before fourth sat in/i, '')
            .replace(/fri before third sat in/i, '')
            .trim();

        const parts = simplifiedStr.replace(/,.*/, '').split(' ');
        let monthIndex = monthNames.findIndex(m => parts[0].startsWith(m));
        
        if (monthIndex === -1) return null;

        const day = parts[1] ? parseInt(parts[1], 10) : 1;

        return {
            month: monthIndex + 1,
            day: day
        };
    };
    
    const seasons = seasonString.split('&');

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
