// Monasteries data and functionality

// Sample monastery data (in a real application, this would come from a backend)
const monasteriesData = [
    {
        id: 1,
        name: "Rumtek Monastery",
        location: "East Sikkim",
        year: 1740,
        description: "One of the largest and most significant monasteries in Sikkim, serving as the main seat of the Karma Kagyu lineage in exile.",
    image: "images/Vikramjit-Kakati-Rumtek.jpeg",
        virtualTourUrl: "monastery-detail.html?id=1",
        latitude: 27.3023,
        longitude: 88.5636,
        festivals: ["Kagyed Dance Festival", "Mahakala Puja"]
    },
    {
        id: 2,
        name: "Pemayangtse Monastery",
        location: "West Sikkim",
        year: 1705,
        description: "One of the oldest and premier monasteries of Sikkim, founded by Lama Lhatsun Chempo.",
    image: "images/Entrance_to_Pemangytse_Gompa.jpeg",
        virtualTourUrl: "monastery-detail.html?id=2",
        latitude: 27.3036,
        longitude: 88.2519,
        festivals: ["Cham Dance", "Losoong Festival"]
    },
    {
        id: 3,
        name: "Enchey Monastery",
        location: "Gangtok",
        year: 1840,
        description: "Built on the site blessed by Lama Druptob Karpo, a tantric master known for his flying powers.",
    image: "images/Enchey_Monastery_in_Gangtok_district,_East_Sikkim.jpeg",
        virtualTourUrl: "monastery-detail.html?id=3",
        latitude: 27.3391,
        longitude: 88.6107,
        festivals: ["Detor Chaam", "Pang Lhabsol"]
    },
    {
        id: 4,
        name: "Tashiding Monastery",
        location: "West Sikkim",
        year: 1641,
        description: "One of the holiest Buddhist monasteries in Sikkim, located atop a heart-shaped hill.",
    image: "images/Mani_stone_slabs_outside_Tashiding_Monastery.jpeg",
        virtualTourUrl: "monastery-detail.html?id=4",
        latitude: 27.3167,
        longitude: 88.3667,
        festivals: ["Bumchu Festival"]
    },
    {
        id: 5,
        name: "Phensang Monastery",
        location: "North Sikkim",
        year: 1721,
        description: "Belonging to the Nyingmapa order, known for its beautiful architecture and religious Tibetan wall paintings.",
    image: "images/Phensong_Monastery.jpeg",
        virtualTourUrl: "monastery-detail.html?id=5",
        latitude: 27.4167,
        longitude: 88.5833,
        festivals: ["Annual Chaam Dance"]
    },
    {
        id: 6,
        name: "Dubdi Monastery",
        location: "West Sikkim",
        year: 1701,
        description: "The oldest monastery in Sikkim, also known as the Hermit's Cell, established by Lhatsun Namkha Jigme.",
    image: "images/Dubdi_Monastery_2.jpeg",
        virtualTourUrl: "monastery-detail.html?id=6",
        latitude: 27.2833,
        longitude: 88.2333,
        festivals: ["Drukpa Tseshi"]
    }
];

// Sample festival data
const festivalsData = [
    {
        id: 1,
        name: "Losoong Festival",
    date: "December 15-18, 2025",
        location: "Various Monasteries",
        description: "Sikkimese New Year celebration with traditional dances and rituals.",
        image: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Losoong_Festival_Sikkim.jpg"
    },
    {
        id: 2,
        name: "Bumchu Festival",
    date: "January 14, 2026",
        location: "Tashiding Monastery",
        description: "Sacred water ceremony predicting the future of Sikkim for the coming year.",
    image: "images/Mani_stone_slabs_outside_Tashiding_Monastery.jpeg"
    },
    {
        id: 3,
        name: "Kagyed Dance Festival",
    date: "February 8-10, 2026",
        location: "Rumtek Monastery",
        description: "Masked dance festival representing the victory of good over evil.",
        image: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Kagyed_Dance_Sikkim.jpg"
    },
    {
        id: 4,
        name: "Saga Dawa",
    date: "June 4, 2026",
        location: "All Monasteries",
        description: "Celebrates Buddha's birth, enlightenment, and parinirvana (death).",
        image: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Saga_Dawa_Sikkim.jpg"
    },
    {
        id: 5,
        name: "Pang Lhabsol",
    date: "August 23, 2026",
        location: "Enchey Monastery",
        description: "Worship of Mount Khangchendzonga as the guardian deity of Sikkim.",
        image: "images/Enchey_Monastery_in_Gangtok_district,_East_Sikkim.jpeg"
    }
];

document.addEventListener('DOMContentLoaded', function() {
    const monasteriesGrid = document.querySelector('.monasteries-grid .grid');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    let monasteriesToShow = 3;
    let currentIndex = 0;
    let allMonasteries = [...monasteriesData];

    function showMonasteries() {
        const toDisplay = allMonasteries.slice(0, currentIndex + monasteriesToShow);
        populateMonasteries(toDisplay, monasteriesGrid);
        currentIndex = toDisplay.length;
        if (currentIndex >= allMonasteries.length) {
            loadMoreBtn.style.display = 'block';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }

    if (monasteriesGrid && loadMoreBtn) {
        showMonasteries();
        loadMoreBtn.addEventListener('click', async function() {
            if (currentIndex < allMonasteries.length) {
                showMonasteries();
            } else {
                // Fetch more from Google API (mocked for now)
                const newMonasteries = await fetchMoreMonasteriesFromGoogle();
                if (newMonasteries.length > 0) {
                    allMonasteries = allMonasteries.concat(newMonasteries);
                    showMonasteries();
                } else {
                    loadMoreBtn.style.display = 'none';
                }
            }
        });
    }

    // Search functionality
    const searchInput = document.getElementById('monasterySearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const filteredMonasteries = allMonasteries.filter(monastery => 
                monastery.name.toLowerCase().includes(searchTerm) || 
                monastery.location.toLowerCase().includes(searchTerm) ||
                monastery.description.toLowerCase().includes(searchTerm)
            );
            populateMonasteries(filteredMonasteries, monasteriesGrid);
        });
    }

    // Sort functionality
    const sortOrder = document.getElementById('sortOrder');
    if (sortOrder) {
        sortOrder.addEventListener('change', function() {
            const value = this.value;
            let sortedMonasteries = [...allMonasteries];
            if (value === 'newest') {
                sortedMonasteries.sort((a, b) => b.year - a.year);
            } else if (value === 'oldest') {
                sortedMonasteries.sort((a, b) => a.year - b.year);
            }
            populateMonasteries(sortedMonasteries, monasteriesGrid);
        });
    }
});

// Mock Google API fetch for more monasteries
async function fetchMoreMonasteriesFromGoogle() {
    // Simulate API call
    return [
        {
            id: Date.now(),
            name: "Google Monastery Example",
            location: "Google Location",
            year: 2020,
            description: "Fetched from Google API. A beautiful monastery with rich history.",
            image: "images/mountains.jpeg",
            virtualTourUrl: "#",
            latitude: 0,
            longitude: 0,
            festivals: ["Google Festival"]
        }
    ];
}

// Function to populate monasteries grid
function populateMonasteries(monasteries, container) {
    container.innerHTML = '';
    
    if (monasteries.length === 0) {
        container.innerHTML = '<div class="no-results">No monasteries found matching your search.</div>';
        return;
    }
    
    monasteries.forEach(monastery => {
        const card = document.createElement('div');
        card.className = 'monastery-card';
        card.dataset.id = monastery.id; // Add data-id attribute for AI integration
        card.innerHTML = `
            <div class="monastery-image">
                <img src="${monastery.image}" alt="${monastery.name}" onerror="this.src='images/placeholder.jpg'">
            </div>
            <div class="monastery-details">
                <h3>${monastery.name}</h3>
                <p>${monastery.description.substring(0, 100)}...</p>
                <div class="monastery-meta">
                    <span><i class="fas fa-map-marker-alt"></i> ${monastery.location}</span>
                    <span><i class="fas fa-calendar-alt"></i> Est. ${monastery.year}</span>
                </div>
                <div class="monastery-features">
                    <h4>Experience Features</h4>
                    <div class="feature-tags">
                        <span class="feature-tag"><i class="fas fa-vr-cardboard"></i> 360° Tour</span>
                        <span class="feature-tag"><i class="fas fa-headphones"></i> Audio Guide</span>
                        <span class="feature-tag"><i class="fas fa-map-marked-alt"></i> Map</span>
                    </div>
                </div>
                <div class="card-actions">
                    <a href="${monastery.virtualTourUrl}" class="view-button">View 360° Tour</a>
                    <button class="ai-insights-btn"><i class="fas fa-robot"></i> AI Insights</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Function to populate festivals slider
function populateFestivals(festivals, container) {
    container.innerHTML = '';
    
    festivals.forEach(festival => {
        const card = document.createElement('div');
        card.className = 'festival-card';
        card.innerHTML = `
            <div class="festival-image">
                <img src="${festival.image}" alt="${festival.name}" onerror="this.src='images/placeholder.jpg'">
            </div>
            <div class="festival-details">
                <span class="festival-date">${festival.date}</span>
                <h3>${festival.name}</h3>
                <p>${festival.description}</p>
                <div class="festival-location">
                    <i class="fas fa-map-marker-alt"></i> ${festival.location}
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Add AI Insights button functionality
function setupAIInsightsButtons() {
    // Check if Gemini AI and Monastery AI are available
    if (!window.geminiAI || !window.monasteryAI) {
        console.log('AI components not loaded yet');
        return;
    }

    // Get all AI Insights buttons
    const aiButtons = document.querySelectorAll('.ai-insights-btn');
    
    aiButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Get monastery card and data
            const card = this.closest('.monastery-card');
            const monasteryId = card.dataset.id;
            const monasteryName = card.querySelector('h3').textContent;
            
            // Show AI insights modal
            if (window.monasteryAI) {
                window.monasteryAI.showAIInsightsModal(monasteryName, monasteryId);
            }
        });
    });
}

// Initialize AI buttons when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Setup initial AI buttons
    setupAIInsightsButtons();
    
    // Setup observer to handle dynamically added monastery cards
    const monasteriesGrid = document.querySelector('.monasteries-grid .grid');
    if (monasteriesGrid) {
        const observer = new MutationObserver(function(mutations) {
            setupAIInsightsButtons();
        });
        
        observer.observe(monasteriesGrid, { childList: true });
    }
});

// Export functions for use in other scripts
window.monasteryUtils = {
    getMonasteryById: function(id) {
        return monasteriesData.find(monastery => monastery.id === parseInt(id));
    },
    getAllMonasteries: function() {
        return monasteriesData;
    },
    getAllFestivals: function() {
        return festivalsData;
    }
};