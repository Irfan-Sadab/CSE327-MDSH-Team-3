class Chatbot {
    constructor() {
        this.API_KEY = 'YOUR API'; // ← Replace with your actual API key
        this.chatMessages = document.getElementById('chatMessages');
        this.userInput = document.getElementById('userInput');
        this.sendButton = document.getElementById('sendButton');
        this.voiceButton = document.getElementById('voiceButton');
        this.imageButton = document.getElementById('imageButton');
        this.imageInput = document.getElementById('imageInput');
        this.imagePreviewContainer = document.getElementById('imagePreviewContainer');
        this.imagePreview = document.getElementById('imagePreview');
        this.removeImageButton = document.getElementById('removeImage');
        
        this.recognition = null;
        this.isRecording = false;
        this.currentImageData = null;
        this.currentImageName = null;
        
        this.initializeEventListeners();
        this.initializeSpeechRecognition();
    }

    initializeEventListeners() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        this.voiceButton.addEventListener('click', () => this.toggleVoiceInput());
        this.imageButton.addEventListener('click', () => this.imageInput.click());
        this.imageInput.addEventListener('change', (e) => this.handleImageUpload(e));
        this.removeImageButton.addEventListener('click', () => this.removeImage());
    }

    initializeSpeechRecognition() {
        try {
            // Try different speech recognition constructors for cross-browser compatibility
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            
            if (SpeechRecognition) {
                this.recognition = new SpeechRecognition();
                this.recognition.continuous = false;
                this.recognition.interimResults = false;
                this.recognition.lang = 'en-US';
                
                this.recognition.onresult = (event) => {
                    console.log('Speech recognition result:', event);
                    if (event.results && event.results[0] && event.results[0][0]) {
                        const transcript = event.results[0][0].transcript;
                        this.userInput.value = transcript;
                        this.stopRecording();
                    }
                };
                
                this.recognition.onerror = (event) => {
                    console.error('Speech recognition error:', event);
                    this.stopRecording();
                    this.addMessage('Sorry, I couldn\'t understand that. Please try again.', 'bot');
                };
                
                this.recognition.onend = () => {
                    console.log('Speech recognition ended');
                    this.stopRecording();
                };
                
                this.recognition.onstart = () => {
                    console.log('Speech recognition started');
                };
            } else {
                console.log('Speech recognition not supported in this browser');
                this.voiceButton.style.display = 'none';
            }
        } catch (error) {
            console.error('Error initializing speech recognition:', error);
            this.voiceButton.style.display = 'none';
        }
    }

    toggleVoiceInput() {
        if (!this.recognition) {
            this.addMessage('Voice input is not supported in your browser.', 'bot');
            return;
        }

        if (this.isRecording) {
            this.stopRecording();
        } else {
            this.startRecording();
        }
    }

    startRecording() {
        try {
            this.userInput.value = ''; // Clear input before recording
            this.recognition.start();
            this.isRecording = true;
            this.voiceButton.classList.add('recording');
            this.voiceButton.textContent = '⏹️';
            console.log('Started recording...');
        } catch (error) {
            console.error('Error starting recording:', error);
            this.stopRecording();
        }
    }

    stopRecording() {
        try {
            if (this.recognition) {
                this.recognition.stop();
            }
        } catch (error) {
            console.error('Error stopping recording:', error);
        }
        this.isRecording = false;
        this.voiceButton.classList.remove('recording');
        this.voiceButton.textContent = '🎤';
        console.log('Stopped recording');
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.currentImageData = e.target.result;
                this.currentImageName = file.name;
                this.showImagePreview();
            };
            reader.readAsDataURL(file);
        }
    }

    showImagePreview() {
        this.imagePreview.src = this.currentImageData;
        this.imagePreviewContainer.style.display = 'block';
    }

    removeImage() {
        this.currentImageData = null;
        this.currentImageName = null;
        this.imagePreviewContainer.style.display = 'none';
        this.imageInput.value = '';
    }

    async sendMessage() {
        const message = this.userInput.value.trim();
        const hasImage = this.currentImageData !== null;
        
        if (!message && !hasImage) return;

        // Add user message to chat FIRST (before clearing data)
        this.addMessage(message, 'user', this.currentImageData, this.currentImageName);
        
        // Store image data temporarily for API call
        const tempImageData = this.currentImageData;
        const tempImageName = this.currentImageName;
        
        // Clear input and image preview
        this.userInput.value = '';
        this.removeImage();
        this.setLoadingState(true);

        try {
            let response;
            if (hasImage) {
                // Pass the temporary image data to the API call
                response = await this.getImageResponse(message, tempImageData);
            } else {
                response = await this.getTextResponse(message);
            }
            this.addMessage(response, 'bot');
        } catch (error) {
            console.error('Error details:', error);
            this.addMessage(`Sorry, I encountered an error: ${error.message}`, 'bot');
        } finally {
            this.setLoadingState(false);
        }
    }

    async getTextResponse(userMessage) {
        const systemPrompt = `You are a helpful assistant specializing in kettles and animals. 
        You should provide accurate, helpful information about:
        1. Kettles - types, features, maintenance, troubleshooting, tea brewing, etc.
        2. Animals - general information, care, behavior, habitats, etc.
        
        Keep responses concise but informative. If asked about topics outside kettles and animals, 
        politely redirect to your areas of expertise.`;

        const requestBody = {
            contents: [{
                parts: [{
                    text: `${systemPrompt}\n\nUser question: ${userMessage}`
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1000
            }
        };

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();

        if (!data.candidates || data.candidates.length === 0) {
            throw new Error('No response candidates received from API');
        }

        if (data.candidates[0].content?.parts?.[0]?.text) {
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error('Unexpected API response format');
        }
    }

    async getImageResponse(userMessage, imageData) {
        // Check if image data exists
        if (!imageData) {
            throw new Error('No image data available');
        }

        // Convert base64 image to the format Gemini expects
        const base64Data = imageData.split(',')[1]; // Remove image/...;base64, prefix
        
        // Determine mime type
        let mimeType = 'image/jpeg';
        if (imageData.startsWith('data:image/png')) {
            mimeType = 'image/png';
        } else if (imageData.startsWith('data:image/gif')) {
            mimeType = 'image/gif';
        } else if (imageData.startsWith('data:image/webp')) {
            mimeType = 'image/webp';
        }

        const parts = [
            {
                inline_data: {
                    mime_type: mimeType,
                    // ✅ FIXED: Field name must be "data", not "base64Data"
                    data: base64Data
                }
            }
        ];
        
        if (userMessage) {
            parts.push({ text: userMessage });
        } else {
            parts.push({ text: "What is this? Please describe what you see in this image, focusing on kettles or animals if relevant." });
        }

        const requestBody = {
            contents: [{
                parts: parts
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1000
            }
        };

        console.log('Sending image request to Gemini API...');
        console.log('Mime type:', mimeType);

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error response:', errorText);
            throw new Error(`API request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log('Image API Response:', data);

        if (!data.candidates || data.candidates.length === 0) {
            throw new Error('No response candidates received from API');
        }

        if (data.candidates[0].content?.parts?.[0]?.text) {
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error('Unexpected API response format');
        }
    }

    addMessage(text, sender, imageData = null, imageName = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        // Add image if present
        if (imageData && sender === 'user') {
            const img = document.createElement('img');
            img.src = imageData;
            img.className = 'image-preview';
            img.style.cssText = 'max-width: 200px; max-height: 200px; border-radius: 8px; margin-bottom: 10px; display: block;';
            contentDiv.appendChild(img);
            
            if (imageName) {
                const nameDiv = document.createElement('small');
                nameDiv.textContent = `Image: ${imageName}`;
                nameDiv.style.display = 'block';
                nameDiv.style.marginBottom = '10px';
                nameDiv.style.opacity = '0.7';
                contentDiv.appendChild(nameDiv);
            }
        }
        
        // Add text if present
        if (text) {
            const textNode = document.createElement('div');
            textNode.textContent = text;
            contentDiv.appendChild(textNode);
        }
        
        const timestampDiv = document.createElement('div');
        timestampDiv.className = 'timestamp';
        timestampDiv.textContent = this.getCurrentTime();
        
        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(timestampDiv);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
        return typingDiv;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    setLoadingState(loading) {
        if (loading) {
            this.sendButton.disabled = true;
            this.userInput.disabled = true;
            this.voiceButton.disabled = true;
            this.imageButton.disabled = true;
            this.showTypingIndicator();
        } else {
            this.sendButton.disabled = false;
            this.userInput.disabled = false;
            this.voiceButton.disabled = false;
            this.imageButton.disabled = false;
            this.hideTypingIndicator();
        }
    }

    getCurrentTime() {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
}

// Initialize the chatbot when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Chatbot();
});