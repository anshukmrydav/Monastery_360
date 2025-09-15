// AI Chatbot for Monasteries 360° website

class MonasteryChatbot {
    constructor() {
        this.initialized = false;
        this.chatHistory = [];
        this.isOpen = false;
    }

    // Initialize the chatbot
    initialize() {
        if (!window.geminiAI || !window.geminiAI.isInitialized()) {
            console.error('Gemini AI is not initialized. Please initialize it first.');
            return false;
        }

        this.initialized = true;
        this.createChatbotUI();
        console.log('Monastery Chatbot initialized successfully');
        return true;
    }

    // Create chatbot UI
    createChatbotUI() {
        // Create chatbot container
        const chatbotContainer = document.createElement('div');
        chatbotContainer.className = 'chatbot-container';
        chatbotContainer.innerHTML = `
            <div class="chatbot-toggle">
                <button class="chatbot-toggle-btn">
                    <i class="fas fa-comment-dots"></i>
                </button>
            </div>
            <div class="chatbot-box">
                <div class="chatbot-header">
                    <h3><i class="fas fa-robot"></i> Monastery Guide</h3>
                    <button class="chatbot-close"><i class="fas fa-times"></i></button>
                </div>
                <div class="chatbot-messages">
                    <div class="message bot-message">
                        <div class="message-content">
                            <p>Hello! I'm your AI monastery guide. Ask me anything about Sikkim's monasteries, Buddhist traditions, or travel tips.</p>
                        </div>
                    </div>
                </div>
                <div class="chatbot-input">
                    <input type="text" placeholder="Type your question here..." class="chatbot-input-field">
                    <button class="chatbot-send-btn"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
        `;

        // Add to body
        document.body.appendChild(chatbotContainer);

        // Add event listeners
        const toggleBtn = chatbotContainer.querySelector('.chatbot-toggle-btn');
        const closeBtn = chatbotContainer.querySelector('.chatbot-close');
        const chatbox = chatbotContainer.querySelector('.chatbot-box');
        const inputField = chatbotContainer.querySelector('.chatbot-input-field');
        const sendBtn = chatbotContainer.querySelector('.chatbot-send-btn');

        toggleBtn.addEventListener('click', () => this.toggleChatbot());
        closeBtn.addEventListener('click', () => this.toggleChatbot(false));
        
        sendBtn.addEventListener('click', () => this.sendMessage());
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Store references
        this.chatbotContainer = chatbotContainer;
        this.chatbox = chatbox;
        this.inputField = inputField;
        this.messagesContainer = chatbotContainer.querySelector('.chatbot-messages');
    }

    // Toggle chatbot visibility
    toggleChatbot(show = null) {
        const newState = show !== null ? show : !this.isOpen;
        this.isOpen = newState;
        
        if (this.isOpen) {
            this.chatbox.classList.add('open');
            this.inputField.focus();
        } else {
            this.chatbox.classList.remove('open');
        }
    }

    // Send message to chatbot
    async sendMessage() {
        if (!this.initialized) return;

        const userInput = this.inputField.value.trim();
        if (!userInput) return;

        // Clear input field
        this.inputField.value = '';

        // Add user message to chat
        this.addMessageToChat('user', userInput);

        // Add to chat history
        this.chatHistory.push({ role: 'user', content: userInput });

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Get response from Gemini AI
            const response = await window.geminiAI.answerMonasteryQuestion(userInput);
            
            // Remove typing indicator
            this.removeTypingIndicator();
            
            // Add bot response to chat
            this.addMessageToChat('bot', response);
            
            // Add to chat history
            this.chatHistory.push({ role: 'bot', content: response });
            
            // Scroll to bottom
            this.scrollToBottom();
            
        } catch (error) {
            // Remove typing indicator
            this.removeTypingIndicator();
            
            // Show error message
            this.addMessageToChat('bot', 'Sorry, I encountered an error. Please try again later.');
            console.error('Chatbot error:', error);
        }
    }

    // Add message to chat UI
    addMessageToChat(role, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}-message`;
        
        // Format content with paragraphs
        const formattedContent = content.split('\n\n')
            .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
            .join('');
        
        messageDiv.innerHTML = `
            <div class="message-content">
                ${formattedContent}
            </div>
        `;
        
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    // Show typing indicator
    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        this.messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }

    // Remove typing indicator
    removeTypingIndicator() {
        const typingIndicator = this.messagesContainer.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Scroll chat to bottom
    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
}

// Create a singleton instance
const monasteryChatbot = new MonasteryChatbot();

// Export the singleton instance
window.monasteryChatbot = monasteryChatbot;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // We'll initialize this from main.js after Gemini AI is initialized
});