// Gemini AI Integration for Monasteries 360°

class GeminiAI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
        this.model = 'models/gemini-1.5-pro-latest';
        this.initialized = false;
    }

    // Initialize the Gemini AI with API key
    initialize(apiKey) {
        if (apiKey) {
            this.apiKey = apiKey;
            this.initialized = true;
            console.log('Gemini AI initialized successfully');
            return true;
        } else {
            console.error('API key is required to initialize Gemini AI');
            return false;
        }
    }

    // Check if API is initialized
    isInitialized() {
        return this.initialized;
    }

    // Generate text response based on prompt
    async generateText(prompt, options = {}) {
        const defaultOptions = {
            temperature: 0.7,
            maxOutputTokens: 800,
            topK: 40,
            topP: 0.95
        };

        const requestOptions = { ...defaultOptions, ...options };
        
        try {
            const response = await fetch(
                `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: prompt
                            }]
                        }],
                        generationConfig: {
                            temperature: requestOptions.temperature,
                            maxOutputTokens: requestOptions.maxOutputTokens,
                            topK: requestOptions.topK,
                            topP: requestOptions.topP
                        }
                    })
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Gemini API Error: ${errorData.error.message || 'Unknown error'}`);
            }

            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('Error generating text with Gemini AI:', error);
            throw error;
        }
    }

    // Generate monastery descriptions
    async generateMonasteryDescription(monasteryName, location, history) {
        const prompt = `Generate a detailed and engaging description for ${monasteryName} located in ${location}. 
        Include information about its historical significance: ${history}. 
        The description should be informative, culturally respectful, and appealing to tourists interested in Buddhist monasteries.`;
        
        return this.generateText(prompt);
    }

    // Generate cultural insights about monasteries
    async generateCulturalInsights(monasteryName, traditions) {
        const prompt = `Provide cultural insights about ${monasteryName} and its traditions: ${traditions}. 
        Focus on unique rituals, festivals, and spiritual practices that visitors might find interesting. 
        Keep the information accurate, respectful, and educational.`;
        
        return this.generateText(prompt);
    }

    // Generate travel tips for monastery visitors
    async generateTravelTips(monasteryName, location, bestTimeToVisit) {
        const prompt = `Provide practical travel tips for visitors planning to visit ${monasteryName} in ${location}. 
        The best time to visit is ${bestTimeToVisit}. 
        Include information about local customs, appropriate attire, photography rules, and etiquette for monastery visits.`;
        
        return this.generateText(prompt);
    }

    // Answer user questions about monasteries
    async answerMonasteryQuestion(question) {
        const prompt = `As a knowledgeable guide about Sikkim's Buddhist monasteries, please answer the following question: 
        ${question} 
        Provide accurate, educational information while being respectful of Buddhist traditions and culture.`;
        
        return this.generateText(prompt);
    }
}

// Create a singleton instance
const geminiAI = new GeminiAI("AIzaSyCBliC6al-UmmiPhmK2NU7mHxpCd6vp1Mw");

// Export the singleton instance
window.geminiAI = geminiAI;