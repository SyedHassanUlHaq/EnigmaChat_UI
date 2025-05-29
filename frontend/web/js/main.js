let currentRecipientId = null;

function toggleDropdown(id) {
    const dropdown = document.getElementById(id);
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

function openChat(userElement) {
    const userId = userElement.getAttribute('data-user-id');
    const userName = userElement.getAttribute('data-user-name');

    currentRecipientId = userId;
    document.querySelector('#chatName').textContent = userName;

    const chatBody = document.querySelector('#chatMessages');
    chatBody.innerHTML = '';

    // Load previous messages
    loadMessages(userId);
}

async function loadMessages(userId) {
    try {
        const response = await pywebview.api.get_messages(userId);
        if (response.status === 'success') {
            const chatBody = document.querySelector('#chatMessages');
            chatBody.innerHTML = '';

            response.messages.forEach(message => {
                const msgDiv = document.createElement('div');
                msgDiv.classList.add('message', message.is_sender ? 'sent' : 'received');

                const messageContent = document.createElement('div');
                messageContent.textContent = message.content;
                msgDiv.appendChild(messageContent);

                // Add encrypted message display
                const encryptedContent = document.createElement('div');
                encryptedContent.classList.add('encrypted-content');
                encryptedContent.textContent = `Encrypted: ${message.encrypted_content}`;
                msgDiv.appendChild(encryptedContent);

                const timeDiv = document.createElement('div');
                timeDiv.classList.add('message-time');
                timeDiv.textContent = new Date(message.created_at).toLocaleTimeString();
                msgDiv.appendChild(timeDiv);

                chatBody.appendChild(msgDiv);
            });

            // Scroll to bottom
            chatBody.scrollTop = chatBody.scrollHeight;
        }
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

function loadUsers() {
    pywebview.api.get_all_users().then(response => {
        const users = response.users;
        const usersContainer = document.querySelector('.users-list');
        usersContainer.innerHTML = '';

        users.forEach(user => {
            const userElement = document.createElement('div');
            userElement.classList.add('user');

            userElement.setAttribute('data-user-id', user.id);
            userElement.setAttribute('data-user-name', user.fullname);

            userElement.innerHTML = `
                <span>${user.fullname}</span>
                <span class="status-indicator ${user.is_online ? 'online' : 'offline'}"></span>
            `;

            userElement.addEventListener('click', () => openChat(userElement));
            usersContainer.appendChild(userElement);
        });
    }).catch(error => {
        console.error('Error fetching users:', error);
    });
}

window.onclick = function (event) {
    if (!event.target.closest('.logged-in-user')) {
        document.querySelectorAll('.dropdown-content').forEach(dropdown => {
            dropdown.style.display = 'none';
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#logoutLink').addEventListener('click', () => {
        window.location.href = 'login.html';
    });

    const sendBtn = document.querySelector('.chat-footer .btn-success');
    const inputField = document.querySelector('.chat-footer input');

    sendBtn.addEventListener('click', async () => {
        const messageText = inputField.value.trim();
        if (!messageText || !currentRecipientId) return;

        try {
            // Encrypt the message
            const encrypted = await pywebview.api.encrypt_message(messageText);
            
            // Send the encrypted message
            const response = await pywebview.api.send_message(currentRecipientId, encrypted);
            
            if (response.status === 'success') {
                // Add message to chat
                const msgDiv = document.createElement('div');
                msgDiv.classList.add('message', 'sent');

                const messageContent = document.createElement('div');
                messageContent.textContent = messageText;
                msgDiv.appendChild(messageContent);

                // Add encrypted message display
                const encryptedContent = document.createElement('div');
                encryptedContent.classList.add('encrypted-content');
                encryptedContent.textContent = `Encrypted: ${encrypted}`;
                msgDiv.appendChild(encryptedContent);

                const timeDiv = document.createElement('div');
                timeDiv.classList.add('message-time');
                timeDiv.textContent = new Date().toLocaleTimeString();
                msgDiv.appendChild(timeDiv);

                document.querySelector('#chatMessages').appendChild(msgDiv);
                inputField.value = '';

                // Scroll to bottom
                const chatBody = document.querySelector('#chatMessages');
                chatBody.scrollTop = chatBody.scrollHeight;
            } else {
                console.error('Failed to send message:', response.message);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    });

    inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendBtn.click();
    });

    // Set up periodic message checking
    setInterval(() => {
        if (currentRecipientId) {
            loadMessages(currentRecipientId);
        }
    }, 5000); // Check for new messages every 5 seconds

    if (window.pywebview) {
        loadUsers();
    } else {
        window.addEventListener('pywebviewready', () => {
            loadUsers();
        });
    }
});
