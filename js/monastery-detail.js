// Monastery Detail Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Get monastery ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const monasteryId = urlParams.get('id');
    
    if (!monasteryId) {
        console.error('No monastery ID provided');
        document.body.innerHTML = '<div class="error-message">Monastery not found. <a href="index.html">Return to home</a></div>';
        return;
    }
    
    // Get monastery data using the utility function from monasteries.js
    const monastery = window.monasteryUtils.getMonasteryById(parseInt(monasteryId));
    
    if (!monastery) {
        console.error('Monastery not found with ID:', monasteryId);
        document.body.innerHTML = '<div class="error-message">Monastery not found. <a href="index.html">Return to home</a></div>';
        return;
    }
    
    // Populate monastery details
    populateMonasteryDetails(monastery);
    
    // Initialize 360° panorama viewer
    initializePanorama(monastery);
    
    // Initialize Google Map
    initializeMap(monastery);
    
    // Initialize gallery
    initializeGallery(monastery);
    
    // Initialize tabs
    initializeTabs();
    
    // Initialize booking form
    initializeBookingForm(monastery);
});

// Function to populate monastery details
function populateMonasteryDetails(monastery) {
    // Set page title
    document.title = `${monastery.name} - Monasteries 360°`;
    
    // Populate header information
    document.getElementById('monasteryName').textContent = monastery.name;
    document.getElementById('monasteryLocation').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${monastery.location}`;
    document.getElementById('monasteryYear').innerHTML = `<i class="fas fa-calendar-alt"></i> Est. ${monastery.year}`;
    
    // Populate description tab
    document.getElementById('monasteryDescription').textContent = monastery.description;
    
    // Populate festivals tab
    const festivalsContainer = document.getElementById('monasteryFestivals');
    if (monastery.festivals && monastery.festivals.length > 0) {
        let festivalsHTML = '<ul class="festivals-list">';
        monastery.festivals.forEach(festival => {
            festivalsHTML += `<li>${festival}</li>`;
        });
        festivalsHTML += '</ul>';
        festivalsContainer.innerHTML = festivalsHTML;
    } else {
        festivalsContainer.innerHTML = '<p>No festival information available for this monastery.</p>';
    }
    
    // Sample data for other tabs (in a real application, this would come from the backend)
    document.getElementById('history').innerHTML = `
        <p>The ${monastery.name} was established in ${monastery.year} and has a rich history spanning several centuries. 
        It has been a center for Buddhist learning and practice, surviving through various historical periods and challenges.</p>
        <p>The monastery has been renovated and expanded several times throughout its history, with major renovations 
        taking place in the early 1900s and again in the 1980s. It continues to be an active place of worship and 
        study for monks and visitors alike.</p>
    `;
    
    document.getElementById('architecture').innerHTML = `
        <p>The ${monastery.name} is built in traditional Tibetan Buddhist architectural style, featuring colorful 
        decorations, intricate woodwork, and symbolic elements. The main prayer hall (dukhang) is the central 
        structure, surrounded by monks' quarters, storage rooms, and administrative offices.</p>
        <p>The monastery houses numerous religious artifacts, including statues of various Buddhist deities, 
        thangka paintings, and ancient manuscripts. The walls are adorned with vibrant murals depicting scenes 
        from Buddhist mythology and the life of Buddha.</p>
    `;
}

// Function to initialize 360° panorama viewer
function initializePanorama(monastery) {
    // Sample panorama data (in a real application, this would come from the backend)
    const panoramaConfig = {
        "default": {
            "firstScene": "entrance",
            "author": "Monasteries 360°",
            "sceneFadeDuration": 1000,
            "autoLoad": true
        },
        
        "scenes": {
            "entrance": {
                "title": "Entrance",
                "hfov": 110,
                "pitch": 0,
                "yaw": 0,
                "type": "equirectangular",
                "panorama": "https://pannellum.org/images/alma.jpg", // Placeholder panorama image
                "hotSpots": [
                    {
                        "pitch": -2.1,
                        "yaw": 132.9,
                        "type": "scene",
                        "text": "Main Prayer Hall",
                        "sceneId": "prayer_hall"
                    },
                    {
                        "pitch": -1.5,
                        "yaw": 222.6,
                        "type": "info",
                        "text": "Entrance Gate"
                    }
                ]
            },
            "prayer_hall": {
                "title": "Main Prayer Hall",
                "hfov": 110,
                "pitch": 0,
                "yaw": 0,
                "type": "equirectangular",
                "panorama": "https://pannellum.org/images/bma-1.jpg", // Placeholder panorama image
                "hotSpots": [
                    {
                        "pitch": -0.6,
                        "yaw": 37.1,
                        "type": "scene",
                        "text": "Entrance",
                        "sceneId": "entrance"
                    },
                    {
                        "pitch": -2.1,
                        "yaw": 132.9,
                        "type": "scene",
                        "text": "Buddha Statue",
                        "sceneId": "buddha_statue"
                    },
                    {
                        "pitch": -1.5,
                        "yaw": 222.6,
                        "type": "info",
                        "text": "Ancient Thangka Paintings"
                    }
                ]
            },
            "buddha_statue": {
                "title": "Buddha Statue",
                "hfov": 110,
                "pitch": 0,
                "yaw": 0,
                "type": "equirectangular",
                "panorama": "https://pannellum.org/images/misery-bay-lake-superior-provincial-park-ontario-canada.jpg", // Placeholder panorama image
                "hotSpots": [
                    {
                        "pitch": -0.6,
                        "yaw": 37.1,
                        "type": "scene",
                        "text": "Main Prayer Hall",
                        "sceneId": "prayer_hall"
                    },
                    {
                        "pitch": -1.5,
                        "yaw": 222.6,
                        "type": "info",
                        "text": "16th Century Buddha Statue"
                    }
                ]
            }
        }
    };
    
    // Initialize pannellum viewer
    const viewer = pannellum.viewer('panorama', panoramaConfig);
    
    // Populate hotspots navigation
    const hotspotsNavigation = document.getElementById('hotspotsNavigation');
    for (const sceneId in panoramaConfig.scenes) {
        const scene = panoramaConfig.scenes[sceneId];
        const hotspotLink = document.createElement('div');
        hotspotLink.className = 'hotspot-link';
        hotspotLink.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${scene.title}`;
        hotspotLink.addEventListener('click', function() {
            viewer.loadScene(sceneId);
        });
        hotspotsNavigation.appendChild(hotspotLink);
    }
    
    // Handle language selection for audio guides
    const languageButtons = document.querySelectorAll('.language-btn');
    const audioGuide = document.getElementById('audioGuide');
    
    languageButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            languageButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Set audio source based on selected language
            const language = this.getAttribute('data-lang');
            // In a real application, you would have different audio files for each language
            audioGuide.src = `audio/${monastery.id}/${language}.mp3`;
            audioGuide.load();
        });
    });
}

// Function to initialize Google Map
function initializeMap(monastery) {
    // Sample nearby attractions data (in a real application, this would come from the backend)
    const nearbyAttractions = [
        {
            name: "Khecheopalri Lake",
            distance: "5 km",
            latitude: monastery.latitude + 0.02,
            longitude: monastery.longitude + 0.02
        },
        {
            name: "Pelling Viewpoint",
            distance: "8 km",
            latitude: monastery.latitude - 0.03,
            longitude: monastery.longitude + 0.01
        },
        {
            name: "Rabdentse Ruins",
            distance: "12 km",
            latitude: monastery.latitude + 0.01,
            longitude: monastery.longitude - 0.04
        },
        {
            name: "Singshore Bridge",
            distance: "15 km",
            latitude: monastery.latitude - 0.05,
            longitude: monastery.longitude - 0.02
        }
    ];
    
    // Populate nearby attractions list
    const attractionsList = document.getElementById('attractionsList');
    nearbyAttractions.forEach(attraction => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            ${attraction.name}
            <span class="attraction-distance">${attraction.distance}</span>
        `;
        attractionsList.appendChild(listItem);
    });
    
    // Populate transport directions
    document.getElementById('carDirections').textContent = `From Gangtok, take NH10 towards ${monastery.location}. The monastery is located approximately 40 km from Gangtok, with clear signage along the route.`;
    
    document.getElementById('busDirections').textContent = `Regular buses run from Gangtok to ${monastery.location}. Take the morning bus from Gangtok Bus Terminal and ask to be dropped off at the monastery entrance.`;
    
    document.getElementById('walkingDirections').textContent = `If staying in ${monastery.location}, the monastery is a 20-minute walk uphill from the main market area. Follow the signs and take the stone-paved path.`;
    
    // Initialize Google Map (commented out as API key is required)
    // In a real application, you would use your Google Maps API key
    /*
    const map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: monastery.latitude, lng: monastery.longitude},
        zoom: 12
    });
    
    // Add marker for monastery
    new google.maps.Marker({
        position: {lat: monastery.latitude, lng: monastery.longitude},
        map: map,
        title: monastery.name,
        icon: {
            url: 'images/icons/monastery-marker.png',
            scaledSize: new google.maps.Size(40, 40)
        }
    });
    
    // Add markers for nearby attractions
    nearbyAttractions.forEach(attraction => {
        new google.maps.Marker({
            position: {lat: attraction.latitude, lng: attraction.longitude},
            map: map,
            title: attraction.name,
            icon: {
                url: 'images/icons/attraction-marker.png',
                scaledSize: new google.maps.Size(30, 30)
            }
        });
    });
    */
    
    // Placeholder for map (since we don't have an API key)
    const mapElement = document.getElementById('map');
    mapElement.style.display = 'flex';
    mapElement.style.justifyContent = 'center';
    mapElement.style.alignItems = 'center';
    mapElement.style.backgroundColor = '#e9ecef';
    mapElement.innerHTML = `
        <div style="text-align: center;">
            <i class="fas fa-map-marked-alt" style="font-size: 3rem; color: var(--primary-color); margin-bottom: 15px;"></i>
            <p>Google Maps will be displayed here with the location of ${monastery.name} and nearby attractions.</p>
            <p><small>Coordinates: ${monastery.latitude}, ${monastery.longitude}</small></p>
        </div>
    `;
}

// Function to initialize gallery
function initializeGallery(monastery) {
    // Sample gallery data (in a real application, this would come from the backend)
    const galleryData = {
        photos: [
            { src: 'images/Dubdi_Monastery_2.jpeg', caption: 'Main Entrance' },
            { src: 'images/Dubdi_Monastery_2.jpeg', caption: 'Prayer Hall' },
            { src: 'images/Dubdi_Monastery_2.jpeg', caption: 'Buddha Statue' },
            { src: 'images/Dubdi_Monastery_2.jpeg', caption: 'Monastery Courtyard' },
            { src: 'images/Dubdi_Monastery_2.jpeg', caption: 'Prayer Wheels' },
            { src: 'images/Dubdi_Monastery_2.jpeg', caption: 'Rooftop View' }
        ],
        manuscripts: [
            { src: 'images/placeholder.jpg', caption: 'Ancient Buddhist Text (15th Century)' },
            { src: 'images/placeholder.jpg', caption: 'Tibetan Prayer Manuscript' },
            { src: 'images/placeholder.jpg', caption: 'Illustrated Buddhist Scripture' },
            { src: 'images/placeholder.jpg', caption: 'Historical Document on Palm Leaf' }
        ],
        murals: [
            { src: 'images/placeholder.jpg', caption: 'Wheel of Life Mural' },
            { src: 'images/placeholder.jpg', caption: 'Buddha\'s Life Story' },
            { src: 'images/placeholder.jpg', caption: 'Celestial Deities' },
            { src: 'images/placeholder.jpg', caption: 'Guardian Deities' }
        ],
        artifacts: [
            { src: 'images/placeholder.jpg', caption: 'Ceremonial Mask' },
            { src: 'images/placeholder.jpg', caption: 'Ritual Objects' },
            { src: 'images/placeholder.jpg', caption: 'Ancient Prayer Bell' },
            { src: 'images/placeholder.jpg', caption: 'Butter Lamp Holder' }
        ]
    };
    
    // Populate gallery grids
    for (const category in galleryData) {
        const galleryGrid = document.getElementById(category);
        if (galleryGrid) {
            galleryData[category].forEach((item, index) => {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';
                galleryItem.innerHTML = `
                    <img src="${item.src}" alt="${item.caption}" onerror="this.src='images/placeholder.jpg'">
                    <div class="gallery-item-caption">${item.caption}</div>
                `;
                
                // Add click event for lightbox
                galleryItem.addEventListener('click', function() {
                    openLightbox(galleryData[category], index);
                });
                
                galleryGrid.appendChild(galleryItem);
            });
        }
    }
    
    // Gallery tab switching
    const galleryTabs = document.querySelectorAll('.gallery-tab');
    const galleryGrids = document.querySelectorAll('.gallery-grid');
    
    galleryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs and grids
            galleryTabs.forEach(t => t.classList.remove('active'));
            galleryGrids.forEach(g => g.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding grid
            this.classList.add('active');
            const galleryId = this.getAttribute('data-gallery');
            document.getElementById(galleryId).classList.add('active');
        });
    });
    
    // Create lightbox elements
    if (!document.querySelector('.lightbox')) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close">&times;</button>
                <img class="lightbox-image" src="" alt="">
                <div class="lightbox-caption"></div>
                <div class="lightbox-nav">
                    <button class="lightbox-prev"><i class="fas fa-chevron-left"></i></button>
                    <button class="lightbox-next"><i class="fas fa-chevron-right"></i></button>
                </div>
            </div>
        `;
        document.body.appendChild(lightbox);
        
        // Close lightbox when clicking close button or outside the image
        const closeBtn = lightbox.querySelector('.lightbox-close');
        closeBtn.addEventListener('click', closeLightbox);
        
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
}

// Function to open lightbox
function openLightbox(items, index) {
    const lightbox = document.querySelector('.lightbox');
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    
    // Set current image and caption
    lightboxImage.src = items[index].src;
    lightboxImage.alt = items[index].caption;
    lightboxCaption.textContent = items[index].caption;
    
    // Show lightbox
    lightbox.classList.add('active');
    
    // Handle navigation buttons
    prevBtn.onclick = function(e) {
        e.stopPropagation();
        index = (index - 1 + items.length) % items.length;
        lightboxImage.src = items[index].src;
        lightboxImage.alt = items[index].caption;
        lightboxCaption.textContent = items[index].caption;
    };
    
    nextBtn.onclick = function(e) {
        e.stopPropagation();
        index = (index + 1) % items.length;
        lightboxImage.src = items[index].src;
        lightboxImage.alt = items[index].caption;
        lightboxCaption.textContent = items[index].caption;
    };
    
    // Prevent scrolling when lightbox is open
    document.body.style.overflow = 'hidden';
}

// Function to close lightbox
function closeLightbox() {
    const lightbox = document.querySelector('.lightbox');
    lightbox.classList.remove('active');
    
    // Re-enable scrolling
    document.body.style.overflow = '';
}

// Function to initialize tabs
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Function to initialize booking form
function initializeBookingForm(monastery) {
    const bookingForm = document.getElementById('visitBookingForm');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                visitDate: document.getElementById('visitDate').value,
                visitTime: document.getElementById('visitTime').value,
                visitorCount: document.getElementById('visitorCount').value,
                guidedTour: document.getElementById('guidedTour').value,
                visitorName: document.getElementById('visitorName').value,
                visitorEmail: document.getElementById('visitorEmail').value,
                visitorPhone: document.getElementById('visitorPhone').value,
                specialRequests: document.getElementById('specialRequests').value
            };
            
            // Calculate amount based on visitor count and guided tour
            const basePrice = 50; // ₹50 per person for Indians
            const guidedTourPrice = formData.guidedTour !== 'no' ? 500 : 0; // ₹500 for guided tour
            const totalAmount = (basePrice * formData.visitorCount) + guidedTourPrice;
            
            // In a real application, you would send this data to your backend
            // and then initiate the RazorPay payment
            
            // Simulate RazorPay integration
            alert(`Booking details submitted! Total amount: ₹${totalAmount}\n\nIn a real application, this would open the RazorPay payment gateway.`);
            
            // RazorPay integration code (commented out as it requires an API key)
            /*
            const options = {
                key: 'YOUR_RAZORPAY_KEY',
                amount: totalAmount * 100, // Amount in paise
                currency: 'INR',
                name: 'Monasteries 360°',
                description: `Booking for ${monastery.name}`,
                image: 'images/logo.png',
                handler: function(response) {
                    // Handle successful payment
                    alert('Payment successful! Your booking is confirmed.');
                    // In a real application, you would send the payment ID to your backend
                },
                prefill: {
                    name: formData.visitorName,
                    email: formData.visitorEmail,
                    contact: formData.visitorPhone
                },
                theme: {
                    color: '#5c9ead'
                }
            };
            
            const razorpay = new Razorpay(options);
            razorpay.open();
            */
        });
    }
    
    // Set minimum date for booking to today
    const visitDateInput = document.getElementById('visitDate');
    if (visitDateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${yyyy}-${mm}-${dd}`;
        visitDateInput.min = formattedDate;
    }
}

// Handle offline download buttons
document.addEventListener('DOMContentLoaded', function() {
    const downloadButtons = document.querySelectorAll('.download-btn');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const downloadType = this.id.replace('download', '');
            alert(`Downloading ${downloadType} for offline use. In a real application, this would download the necessary files.`);
        });
    });
    
    // Setup AI Insights button
    setupAIInsightsButton();
});

// Function to setup AI Insights button
function setupAIInsightsButton() {
    const aiInsightsBtn = document.getElementById('detailAiInsightsBtn');
    
    if (aiInsightsBtn) {
        aiInsightsBtn.addEventListener('click', function() {
            // Get monastery ID from URL parameter
            const urlParams = new URLSearchParams(window.location.search);
            const monasteryId = urlParams.get('id');
            
            if (!monasteryId) {
                console.error('No monastery ID provided');
                return;
            }
            
            // Get monastery data
            const monastery = window.monasteryUtils.getMonasteryById(parseInt(monasteryId));
            
            if (!monastery) {
                console.error('Monastery not found with ID:', monasteryId);
                return;
            }
            
            // Show AI insights modal if Monastery AI is available
            if (window.monasteryAI) {
                window.monasteryAI.showAIInsightsModal(monastery.name, monasteryId);
            } else {
                console.error('Monastery AI not initialized');
                alert('AI features are not available. Please make sure you have set up your Gemini API key.');
            }
        });
    }
}