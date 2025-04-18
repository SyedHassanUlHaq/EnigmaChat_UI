let currentRecipientId = null;
let currentSharedSecret = null; // 🔐 Save shared secret globally

function toggleDropdown(id) {
    const dropdown = document.getElementById(id);
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

function openChat(userElement) {
    const userId = userElement.getAttribute('data-user-id');
    const userName = userElement.getAttribute('data-user-name');
    // const userAvatar = userElement.getAttribute('data-user-avatar');
    const userEk = userElement.getAttribute('data-user-ek');

    currentRecipientId = userId;

    document.querySelector('#chatName').textContent = userName;
    // document.querySelector('#chatAvatar').src = userAvatar;

    const chatBody = document.querySelector('#chatMessages');
    chatBody.innerHTML = '';

    pywebview.api.create_shared_secret(userEk)
        .then(([k, c]) => {
            currentSharedSecret = k; // ✅ Store shared secret
            console.log("Shared secret established:", k, c);
            const infoDiv = document.createElement('div');
            infoDiv.classList.add('message', 'system');
            infoDiv.textContent = `Shared secret established.`;
            chatBody.appendChild(infoDiv);
        })
        .catch(error => {
            console.error("Failed to create shared secret:", error);
        });
}

function loadUsers() {
    pywebview.api.get_all_users().then(response => {
        const users = response.users;
        const usersContainer = document.querySelector('.users-list');
        usersContainer.innerHTML = '';

        users.forEach(user => {
            const userElement = document.createElement('div');
            userElement.classList.add('user');

            const avatar = user.profile_picture_url.replace('/static/profile_pictures/', 'images/');

            userElement.setAttribute('data-user-id', user.id);
            userElement.setAttribute('data-user-name', user.fullname);
            userElement.setAttribute('data-user-avatar', avatar);
            userElement.setAttribute('data-user-ek', user.ek);

            userElement.innerHTML = `
                <span>${user.fullname}</span>
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
        window.location.href = 'frontend/web/login.html';
    });

    const sendBtn = document.querySelector('.chat-footer .btn-success');
    const inputField = document.querySelector('.chat-footer input');

    sendBtn.addEventListener('click', async () => {
        const messageText = inputField.value.trim();
        if (!messageText || !currentRecipientId || !currentSharedSecret) return;

        try {
            const encrypted = await pywebview.api.encrypt_message(currentSharedSecret, messageText);

            const msgDiv = document.createElement('div');
            msgDiv.classList.add('message', 'sent');

            const plaintextDiv = document.createElement('div');
            plaintextDiv.textContent = messageText;

            const encryptedDiv = document.createElement('div');
            encryptedDiv.textContent = encrypted;
            encryptedDiv.style.fontSize = '0.75em';
            encryptedDiv.style.color = '#888';

            msgDiv.appendChild(plaintextDiv);
            msgDiv.appendChild(encryptedDiv);

            document.querySelector('#chatMessages').appendChild(msgDiv);
            inputField.value = '';

            // Optional: send encrypted message to backend
            // await pywebview.api.send_encrypted_message(currentRecipientId, encrypted);

        } catch (error) {
            console.error("Encryption failed:", error);
        }
    });

    inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendBtn.click();
    });

    if (window.pywebview) {
        loadUsers();
    } else {
        window.addEventListener('pywebviewready', () => {
            loadUsers();
        });
    }
});
