// Contact Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize accordion functionality
    initializeAccordion();
    
    // Initialize contact form
    initializeContactForm();
    
    // Initialize Google Map (commented out as API key is required)
    // initializeMap();
});

// Function to initialize accordion
function initializeAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', function() {
            // Toggle active class on clicked item
            item.classList.toggle('active');
            
            // Close other accordion items
            accordionItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
        });
    });
}

// Function to initialize contact form
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // Validate form data
            if (!validateForm(formData)) {
                return;
            }
            
            // In a real application, you would send this data to your backend
            // For now, we'll just show a success message
            alert('Thank you for your message! We will get back to you soon.');
            
            // Reset form
            contactForm.reset();
        });
    }
}

// Function to validate form data
function validateForm(formData) {
    // Check if name is valid
    if (formData.name.trim() === '') {
        alert('Please enter your name.');
        return false;
    }
    
    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        alert('Please enter a valid email address.');
        return false;
    }
    
    // Check if subject is valid
    if (formData.subject.trim() === '') {
        alert('Please enter a subject.');
        return false;
    }
    
    // Check if message is valid
    if (formData.message.trim() === '') {
        alert('Please enter your message.');
        return false;
    }
    
    return true;
}

// Function to initialize Google Map
function initializeMap() {
    // This function would initialize Google Maps with your API key
    // For now, we'll just use a placeholder
    
    /*
    // Sample coordinates for Gangtok, Sikkim
    const sikkimCoordinates = { lat: 27.3389, lng: 88.6065 };
    
    const map = new google.maps.Map(document.getElementById('map'), {
        center: sikkimCoordinates,
        zoom: 12
    });
    
    // Add marker for office location
    new google.maps.Marker({
        position: sikkimCoordinates,
        map: map,
        title: 'Monasteries 360° Office',
        icon: {
            url: 'images/icons/office-marker.png',
            scaledSize: new google.maps.Size(40, 40)
        }
    });
    */
}