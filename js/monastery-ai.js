// Monastery AI Integration - Enhances monastery blocks with AI features

class MonasteryAI {
    constructor() {
        this.initialized = false;
        this.monasteryBlocks = document.querySelectorAll('.monastery-card');
        this.aiDescriptionCache = {}; // Cache for AI-generated descriptions
    }

    // Initialize the MonasteryAI integration
    initialize() {
        if (!window.geminiAI || !window.geminiAI.isInitialized()) {
            console.error('Gemini AI is not initialized. Please initialize it first.');
            return false;
        }

        this.initialized = true;
        this.addAIButtonsToMonasteryCards();
        console.log('Monastery AI integration initialized successfully');
        return true;
    }

    // Add AI enhancement buttons to monastery cards
    addAIButtonsToMonasteryCards() {
        if (!this.initialized) return;

        this.monasteryBlocks = document.querySelectorAll('.monastery-card');
        
        this.monasteryBlocks.forEach(card => {
            const monasteryName = card.querySelector('h3').textContent;
            const actionsDiv = card.querySelector('.card-actions') || this.createCardActionsDiv(card);
            
            // Add AI Insights button if it doesn't exist
            if (!actionsDiv.querySelector('.ai-insights-btn')) {
                const aiButton = document.createElement('button');
                aiButton.className = 'ai-insights-btn';
                aiButton.innerHTML = '<i class="fas fa-robot"></i> AI Insights';
                aiButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.showAIInsightsModal(monasteryName, card.dataset.id);
                });
                actionsDiv.appendChild(aiButton);
            }
        });
    }

    // Create card actions div if it doesn't exist
    createCardActionsDiv(card) {
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'card-actions';
        card.appendChild(actionsDiv);
        return actionsDiv;
    }

    // Show AI insights modal for a monastery
    async showAIInsightsModal(monasteryName, monasteryId) {
        // Create modal container
        const modal = document.createElement('div');
        modal.className = 'ai-insights-modal';
        modal.innerHTML = `
            <div class="ai-insights-content">
                <div class="ai-insights-header">
                    <h3>AI Insights: ${monasteryName}</h3>
                    <button class="close-modal"><i class="fas fa-times"></i></button>
                </div>
                <div class="ai-insights-tabs">
                    <button class="tab-btn active" data-tab="description">Description</button>
                    <button class="tab-btn" data-tab="cultural">Cultural Insights</button>
                    <button class="tab-btn" data-tab="travel">Travel Tips</button>
                </div>
                <div class="ai-insights-body">
                    <div class="tab-content active" id="description-content">
                        <div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Generating AI description...</div>
                    </div>
                    <div class="tab-content" id="cultural-content">
                        <div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Generating cultural insights...</div>
                    </div>
                    <div class="tab-content" id="travel-content">
                        <div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Generating travel tips...</div>
                    </div>
                </div>
                <div class="ai-insights-footer">
                    <p><small>Powered by Google Gemini AI</small></p>
                </div>
            </div>
        `;

        // Add modal to body
        document.body.appendChild(modal);

        // Add event listeners
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });

        // Tab switching functionality
        const tabBtns = modal.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all tabs
                tabBtns.forEach(b => b.classList.remove('active'));
                modal.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab
                btn.classList.add('active');
                const tabId = btn.dataset.tab;
                modal.querySelector(`#${tabId}-content`).classList.add('active');
                
                // Load content if not already loaded
                this.loadTabContent(tabId, monasteryName, monasteryId, modal);
            });
        });

        // Load initial tab content
        this.loadTabContent('description', monasteryName, monasteryId, modal);
    }

    // Load tab content with AI-generated information
    async loadTabContent(tabType, monasteryName, monasteryId, modal) {
        const contentDiv = modal.querySelector(`#${tabType}-content`);
        const cacheKey = `${monasteryId}-${tabType}`;
        
        // Check if content is already loaded or in cache
        if (contentDiv.querySelector('.ai-content')) return;
        if (this.aiDescriptionCache[cacheKey]) {
            contentDiv.innerHTML = `<div class="ai-content">${this.aiDescriptionCache[cacheKey]}</div>`;
            return;
        }

        // Get monastery data
        const monasteryData = this.getMonasteryData(monasteryId);
        if (!monasteryData) {
            contentDiv.innerHTML = '<p class="error-message">Could not find monastery data.</p>';
            return;
        }

        try {
            let aiContent = '';
            
            switch (tabType) {
                case 'description':
                    aiContent = await window.geminiAI.generateMonasteryDescription(
                        monasteryName, 
                        monasteryData.location, 
                        `Founded in ${monasteryData.year}`
                    );
                    break;
                case 'cultural':
                    aiContent = await window.geminiAI.generateCulturalInsights(
                        monasteryName,
                        monasteryData.festivals.join(', ')
                    );
                    break;
                case 'travel':
                    aiContent = await window.geminiAI.generateTravelTips(
                        monasteryName,
                        monasteryData.location,
                        'Spring and Autumn'
                    );
                    break;
            }

            // Format the content with paragraphs
            const formattedContent = aiContent.split('\n\n').map(p => `<p>${p}</p>`).join('');
            
            // Cache the result
            this.aiDescriptionCache[cacheKey] = formattedContent;
            
            // Update the content
            contentDiv.innerHTML = `<div class="ai-content">${formattedContent}</div>`;
            
        } catch (error) {
            contentDiv.innerHTML = `<p class="error-message">Error generating content: ${error.message}</p>`;
        }
    }

    // Get monastery data by ID
    getMonasteryData(monasteryId) {
        // This assumes monasteriesData is globally available from monasteries.js
        if (typeof monasteriesData !== 'undefined') {
            return monasteriesData.find(m => m.id == monasteryId);
        }
        return null;
    }
}

// Create a singleton instance
const monasteryAI = new MonasteryAI();

// Export the singleton instance
window.monasteryAI = monasteryAI;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // We'll initialize this from main.js after Gemini AI is initialized
});