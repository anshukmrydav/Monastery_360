// google-image-api.js
// Utility to fetch images from Google Custom Search API
// Requires: API_KEY and CX (Custom Search Engine ID)

const GOOGLE_API_KEY = 'AIzaSyD0q35grAdC7QFDcxEjNJlzGY85G4wpGUM'; // <-- User's Google API key
const GOOGLE_CX = '726d6525bef0c400d'; // <-- User's Google CX ID

/**
 * Fetch images from Google Custom Search API for a given query
 * @param {string} query - Search query
 * @param {number} num - Number of images to fetch (max 10 per request)
 * @returns {Promise<Array<{src: string, caption: string}>>}
 */
async function fetchGoogleImages(query, num = 6) {
    const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CX}&searchType=image&q=${encodeURIComponent(query)}&num=${num}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch images');
    const data = await res.json();
    if (!data.items) return [];
    return data.items.map(item => ({
        src: item.link,
        caption: item.title || query
    }));
}

window.fetchGoogleImages = fetchGoogleImages;