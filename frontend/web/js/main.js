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
        const currentUser = await pywebview.api.get_current_user();
        if (!currentUser || !currentUser.id) {
            console.error('No current user found');
            return;
        }

        const response = await pywebview.api.get_messages(currentUser.id, userId);
        if (response.status === 'success') {
            const chatBody = document.querySelector('#chatMessages');
            chatBody.innerHTML = '';

            response.messages.forEach(message => {
                const msgDiv = document.createElement('div');
                msgDiv.classList.add('message', message.is_sender ? 'sent' : 'received');

                const messageContent = document.createElement('div');
                messageContent.classList.add('message-content');
                messageContent.textContent = message.content;
                msgDiv.appendChild(messageContent);

                // Add encrypted content display
                const encryptedContent = document.createElement('div');
                encryptedContent.classList.add('encrypted-content');
                encryptedContent.textContent = `Encrypted: ${message.encrypted_content}`;
                msgDiv.appendChild(encryptedContent);

                const timeDiv = document.createElement('div');
                timeDiv.classList.add('message-time');
                // Convert to Pakistan time (UTC+5)
                const date = new Date(message.created_at);
                const pakistanTime = new Date(date.getTime() + (5 * 60 * 60 * 1000)); // Add 5 hours
                timeDiv.textContent = pakistanTime.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                    timeZone: 'Asia/Karachi'
                });
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
        localStorage.removeItem('currentUserEmail');
        window.location.href = 'login.html';
    });

    const sendBtn = document.querySelector('.chat-footer .btn-success');
    const inputField = document.querySelector('.chat-footer input');

    sendBtn.addEventListener('click', async () => {
        const messageText = inputField.value.trim();
        if (!messageText || !currentRecipientId) return;

        try {
            // Get current user ID
            const currentUser = await pywebview.api.get_current_user();
            if (!currentUser || !currentUser.id) {
                console.error('No current user found');
                return;
            }

            // Send the message
            const response = await pywebview.api.send_message(currentUser.id, currentRecipientId, messageText);
            
            if (response.status === 'success') {
                // Add message to chat
                const msgDiv = document.createElement('div');
                msgDiv.classList.add('message', 'sent');

                // Add sender info
                const senderInfo = document.createElement('div');
                senderInfo.classList.add('sender-info');
                senderInfo.textContent = 'You';
                msgDiv.appendChild(senderInfo);

                const messageContent = document.createElement('div');
                messageContent.classList.add('message-content');
                messageContent.textContent = messageText;
                msgDiv.appendChild(messageContent);

                // Add encrypted message display
                const encryptedContent = document.createElement('div');
                encryptedContent.classList.add('encrypted-content');
                encryptedContent.textContent = `Encrypted: ${response.encrypted_content}`;
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

    const loginBtn = document.querySelector('#loginBtn');
    const registerBtn = document.querySelector('#registerBtn');

    loginBtn.addEventListener('click', async () => {
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;

        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const response = await pywebview.api.authenticate_user(email, password);
            if (response.status === 'success') {
                setCurrentUserEmail(email);
                
                document.querySelector('#loginForm').style.display = 'none';
                document.querySelector('#chatContainer').style.display = 'flex';
                loadUsers();
            } else {
                alert(response.message || 'Login failed');
            }
        } catch (error) {
            console.error("Login error:", error);
            alert('Login failed');
        }
    });

    registerBtn.addEventListener('click', async () => {
        const fullname = document.querySelector('#fullname').value;
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;
        const confirmPassword = document.querySelector('#confirm-password').value;
        const profilePicture = document.querySelector('#profile-picture').files[0];

        if (!fullname || !email || !password || !confirmPassword || !profilePicture) {
            alert('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            // Handle profile picture upload
            const formData = new FormData();
            formData.append('profile_picture', profilePicture);
            
            // Get the profile picture path
            const profilePicturePath = await handleProfilePictureUpload(formData);
            
            const response = await pywebview.api.register_user(fullname, email, password, profilePicturePath);
            if (response.status === 'success') {
                alert('Registration successful! Please login.');
                document.querySelector('#registerForm').style.display = 'none';
                document.querySelector('#loginForm').style.display = 'block';
            } else {
                alert(response.message || 'Registration failed');
            }
        } catch (error) {
            console.error("Registration error:", error);
            alert('Registration failed');
        }
    });

    async function handleProfilePictureUpload(formData) {
        // TODO: Implement profile picture upload
        // For now, return a default path
        return 'default_profile.jpg';
    }

    function setCurrentUserEmail(email) {
        localStorage.setItem('currentUserEmail', email);
    }

    function getCurrentUserEmail() {
        return localStorage.getItem('currentUserEmail');
    }
});
