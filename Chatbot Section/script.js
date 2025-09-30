class Chatbot {
    constructor() {
        this.API_KEY = 'Your API Key'; // 🔑 Replace with your actual Gemini API key
        this.chatMessages = document.getElementById('chatMessages');
        this.userInput = document.getElementById('userInput');
        this.sendButton = document.getElementById('sendButton');
        this.voiceButton = document.getElementById('voiceButton');
        this.imageButton = document.getElementById('imageButton');
        this.imageInput = document.getElementById('imageInput');
        this.imagePreviewContainer = document.getElementById('imagePreviewContainer');

        this.currentImageData = null;
        this.currentImageName = null;

        this.recognition = null;
        this.isRecording = false;

        this.initializeEventListeners();
        this.initializeSpeechRecognition();
    }

    initializeEventListeners() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        this.voiceButton.addEventListener('click', () => this.toggleVoiceInput());
        this.imageButton.addEventListener('click', () => this.imageInput.click());
        this.imageInput.addEventListener('change', (e) => this.handleImageUpload(e));
    }

    initializeSpeechRecognition() {
        try {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                this.voiceButton.style.display = 'none';
                return;
            }

            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            this.recognition.onresult = (event) => {
                if (event.results?.[0]?.[0]) {
                    this.userInput.value = event.results[0][0].transcript;
                    this.stopRecording();
                }
            };

            this.recognition.onerror = () => {
                this.stopRecording();
                this.addMessage('Sorry, I couldn\'t understand that. Please try again.', 'bot');
            };

            this.recognition.onend = () => this.stopRecording();
        } catch (error) {
            console.error('Speech recognition init failed:', error);
            this.voiceButton.style.display = 'none';
        }
    }

    toggleVoiceInput() {
        if (!this.recognition) {
            this.addMessage('Voice input is not supported in your browser.', 'bot');
            return;
        }
        this.isRecording ? this.stopRecording() : this.startRecording();
    }

    startRecording() {
        try {
            this.userInput.value = '';
            this.recognition.start();
            this.isRecording = true;
            this.voiceButton.classList.add('recording');
            this.voiceButton.textContent = '⏹️';
        } catch {
            this.stopRecording();
        }
    }

    stopRecording() {
        try {
            if (this.recognition) this.recognition.stop();
        } catch {}
        this.isRecording = false;
        this.voiceButton.classList.remove('recording');
        this.voiceButton.textContent = '🎤';
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.currentImageData = e.target.result;
                this.currentImageName = file.name;

                // Show preview in input bar
                this.imagePreviewContainer.innerHTML = '';
                const img = document.createElement('img');
                img.src = this.currentImageData;
                img.alt = this.currentImageName;

                const removeBtn = document.createElement('span');
                removeBtn.textContent = '✖';
                removeBtn.className = 'remove-preview';
                removeBtn.onclick = () => {
                    this.currentImageData = null;
                    this.currentImageName = null;
                    this.imagePreviewContainer.innerHTML = '';
                    this.imageInput.value = '';
                };

                this.imagePreviewContainer.appendChild(img);
                this.imagePreviewContainer.appendChild(removeBtn);
            };
            reader.readAsDataURL(file);
        }
    }

    async sendMessage() {
        const message = this.userInput.value.trim();
        const hasImage = this.currentImageData !== null;
        if (!message && !hasImage) return;

        this.addMessage(message, 'user', this.currentImageData, this.currentImageName);

        const tempImageData = this.currentImageData;
        const tempImageName = this.currentImageName;

        this.userInput.value = '';
        this.currentImageData = null;
        this.currentImageName = null;
        this.imageInput.value = '';
        this.imagePreviewContainer.innerHTML = '';

        this.setLoadingState(true);

        try {
            let response;
            if (hasImage) {
                response = await this.getImageResponse(message, tempImageData);
            } else {
                response = await this.getTextResponse(message);
            }
            this.addMessage(response, 'bot');
        } catch (error) {
            this.addMessage(`Sorry, I encountered an error: ${error.message}`, 'bot');
        } finally {
            this.setLoadingState(false);
        }
    }

    async getTextResponse(userMessage) {
        const systemPrompt = `You are a helpful veterinary assistant. 
        Provide concise, accurate info about:
        - Cattle, pets, and farm animals (care, feeding, diseases, diagnosis).
        - General veterinary questions.
        Politely redirect if asked about non-veterinary topics.`;

        const requestBody = {
            contents: [{
                parts: [{ text: `${systemPrompt}\n\nUser: ${userMessage}` }]
            }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
        };

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.API_KEY}`,
            { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody) }
        );

        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();
        const partsOut = data.candidates?.[0]?.content?.parts || [];
        const textResponse = partsOut.filter(p => p.text).map(p => p.text).join("\n");
        return textResponse || 'No response.';
    }

    async getImageResponse(userMessage, imageData) {
        const base64Data = imageData.split(',')[1];
        let mimeType = 'image/jpeg';
        if (imageData.startsWith('data:image/png')) mimeType = 'image/png';
        else if (imageData.startsWith('data:image/gif')) mimeType = 'image/gif';
        else if (imageData.startsWith('data:image/webp')) mimeType = 'image/webp';

        // ✅ Correct schema: inline_data + mime_type
        const parts = [
            {
                inline_data: {
                    mime_type: mimeType,
                    data: base64Data
                }
            },
            { text: userMessage || "Describe this image related to animals." }
        ];

        const requestBody = {
            contents: [{ role: "user", parts }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
        };

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.API_KEY}`,
            { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody) }
        );

        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();
		console.log("🔍 Raw Gemini image response:", JSON.stringify(data, null, 2));

        const partsOut = data.candidates?.[0]?.content?.parts || [];
        const textResponse = partsOut.filter(p => p.text).map(p => p.text).join("\n");

        return textResponse || 'No description.';
    }

    addMessage(text, sender, imageData = null, imageName = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'avatar';
        if (sender === 'user') {
            const img = document.createElement('img');
            img.src = 'user-icon.png';
            img.alt = 'User';
            avatarDiv.appendChild(img);
        } else {
            avatarDiv.textContent = '🐾';
        }

        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'bubble';

        if (imageData && sender === 'user') {
            const img = document.createElement('img');
            img.src = imageData;
            img.className = 'image-preview';
            img.style.cssText = 'max-width: 200px; max-height: 200px; border-radius: 8px; margin-bottom: 10px; display: block;';
            bubbleDiv.appendChild(img);

            if (imageName) {
                const nameDiv = document.createElement('small');
                nameDiv.textContent = `Image: ${imageName}`;
                nameDiv.style.display = 'block';
                nameDiv.style.marginBottom = '10px';
                nameDiv.style.opacity = '0.7';
                bubbleDiv.appendChild(nameDiv);
            }
        }

        if (text) {
            const textNode = document.createElement('div');
            textNode.textContent = text;
            bubbleDiv.appendChild(textNode);
        }

        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(bubbleDiv);
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message';
        typingDiv.id = 'typingIndicator';

        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'avatar';
        avatarDiv.textContent = '🐾';

        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'bubble typing-indicator';
        bubbleDiv.innerHTML = `<span></span><span></span><span></span>`;

        typingDiv.appendChild(avatarDiv);
        typingDiv.appendChild(bubbleDiv);
        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
        return typingDiv;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) typingIndicator.remove();
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

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Chatbot();
});
