document.addEventListener('DOMContentLoaded', function() {
    // Éléments du DOM
    const fileInput = document.getElementById('conversation-file');
    const fileName = document.getElementById('file-name');
    const textArea = document.getElementById('conversation-text');
    const convertBtn = document.getElementById('convert-btn');
    const useExampleBtn = document.getElementById('use-example-btn');
    const previewSection = document.getElementById('preview-section');
    const chatBody = document.getElementById('chat-body');
    const chatTitle = document.getElementById('chat-title');
    const chatParticipants = document.getElementById('chat-participants');

    // Écouteurs d'événements
    fileInput.addEventListener('change', handleFileInput);
    convertBtn.addEventListener('click', convertConversation);
    useExampleBtn.addEventListener('click', loadExampleConversation);

    // Gestion du changement de fichier
    function handleFileInput(e) {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            fileName.textContent = file.name;
            
            // Lire le contenu du fichier
            const reader = new FileReader();
            reader.onload = function(event) {
                textArea.value = event.target.result;
            };
            reader.readAsText(file);
        } else {
            fileName.textContent = 'Aucun fichier sélectionné';
        }
    }

    // Chargement de l'exemple
    function loadExampleConversation() {
        fetch('Conversation.txt')
            .then(response => response.text())
            .then(data => {
                textArea.value = data;
            })
            .catch(error => {
                console.error('Erreur lors du chargement de l\'exemple:', error);
                alert('Impossible de charger l\'exemple de conversation');
            });
    }

    // Conversion du texte en format de conversation visuelle
    function convertConversation() {
        const conversationText = textArea.value.trim();
        
        if (!conversationText) {
            alert('Veuillez saisir ou charger une conversation');
            return;
        }

        // Analyser le texte de la conversation
        const messages = parseConversation(conversationText);
        
        // Récupérer les participants uniques
        const participants = [...new Set(messages.map(msg => msg.sender))];
        
        // Mettre à jour les informations de la conversation
        updateChatInfo(participants);
        
        // Afficher les messages
        displayMessages(messages);
        
        // Afficher la section d'aperçu
        previewSection.style.display = 'block';
        
        // Scroller vers le bas de la conversation
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    // Analyse du texte de la conversation
    function parseConversation(text) {
        const lines = text.split('\n');
        const messages = [];
        
        // Format attendu: "YYYY-MM-DD HH:MM Sender: Message"
        const regex = /^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}|\d{4}-\d{2}-\d{2} \d{2}:\d{2}) ([^:]+): (.+)$/;
        
        lines.forEach(line => {
            const match = line.match(regex);
            if (match) {
                const [, datetime, sender, content] = match;
                const date = new Date(datetime);
                const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                // Traitement spécial pour les messages de TWAIN qui utilisent des barres verticales
                let messageContent = content.trim();
                if (sender === 'TWAIN' && messageContent.includes('|')) {
                    messageContent = messageContent.replace(/\|/g, '<br>');
                }
                
                messages.push({
                    datetime: date,
                    time: time,
                    sender: sender.trim(),
                    content: messageContent
                });
            }
        });
        
        return messages;
    }

    // Mise à jour des informations de la conversation
    function updateChatInfo(participants) {
        chatTitle.textContent = 'Conversation';
        chatParticipants.textContent = participants.join(', ');
    }

    // Affichage des messages dans l'interface
    function displayMessages(messages) {
        chatBody.innerHTML = '';
        
        let currentSender = null;
        let colorMap = new Map();
        let colorIndex = 0;
        const colors = ['#128C7E', '#25D366', '#34B7F1', '#075E54', '#7D3C98', '#2874A6', '#E74C3C', '#F39C12'];
        
        messages.forEach(message => {
            if (!colorMap.has(message.sender)) {
                colorMap.set(message.sender, colors[colorIndex % colors.length]);
                colorIndex++;
            }
            
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            
            const isCurrentUser = message.sender === 'TWAIN'; 
            if (isCurrentUser) {
                messageElement.classList.add('message-sent');
            } else {
                messageElement.classList.add('message-received');
            }
            
            let messageHTML = '';
            
            if (!isCurrentUser) {
                messageHTML += `<div class="message-sender" style="color: ${colorMap.get(message.sender)}">${message.sender}</div>`;
            }
            
            messageHTML += `
                <div class="message-content">${formatMessageContent(message.content)}</div>
                <div class="message-info">
                    <div class="message-time">${message.time}</div>
                </div>
            `;
            
            messageElement.innerHTML = messageHTML;
            chatBody.appendChild(messageElement);
            
            currentSender = message.sender;
        });
    }

    function formatMessageContent(content) {
        content = content.replace(/:\)/g, '😊')
                         .replace(/:\(/g, '😞')
                         .replace(/:D/g, '😃')
                         .replace(/<3/g, '❤️');
        
        content = content.replace(
            /(https?:\/\/[^\s]+)/g, 
            '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
        );
        
        return content;
    }
}); 