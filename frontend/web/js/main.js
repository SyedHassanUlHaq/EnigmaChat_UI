// Function to toggle the dropdown menu
function toggleDropdown(id) {
    const dropdown = document.getElementById(id);
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

// Function to handle opening a user's chat dynamically
function openChat(userElement) {
    const userId = userElement.getAttribute('data-user-id');
    const userName = userElement.getAttribute('data-user-name');
    const userAvatar = userElement.getAttribute('data-user-avatar');

    // Update chat header with selected user details
    document.querySelector('#chatName').textContent = userName;
    document.querySelector('#chatAvatar').src = userAvatar;

    // Clear chat body
    const chatBody = document.querySelector('#chatMessages');
    chatBody.innerHTML = '';

    // Placeholder messages (replace with API call for real messages)
    const messages = [
        { text: 'Hello, how are you?', type: 'received' },
        { text: 'I am fine, thank you!', type: 'sent' }
    ];

    // Dynamically add messages
    messages.forEach(msg => {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', msg.type);
        msgDiv.textContent = msg.text;
        chatBody.appendChild(msgDiv);
    });
}

// Function to fetch users and populate the sidebar
function loadUsers() {
    window.pywebview.api.get_users().then(users => {
        const usersContainer = document.querySelector('.users-list');
        usersContainer.innerHTML = '';

        users.forEach(user => {
            const userElement = document.createElement('div');
            userElement.classList.add('user');
            userElement.setAttribute('data-user-id', user.id);
            userElement.setAttribute('data-user-name', user.fullname);
            userElement.setAttribute('data-user-avatar', `uploads/profile_pictures/${user.profile_picture}`);

            userElement.innerHTML = `
                <img src="uploads/profile_pictures/${user.profile_picture}" alt="${user.fullname}">
                <span>${user.fullname}</span>
            `;

            userElement.addEventListener('click', () => openChat(userElement));
            usersContainer.appendChild(userElement);
        });
    }).catch(error => {
        console.error('Error fetching users:', error);
    });
}

// Close dropdown when clicking outside
window.onclick = function (event) {
    if (!event.target.closest('.logged-in-user')) {
        document.querySelectorAll('.dropdown-content').forEach(dropdown => {
            dropdown.style.display = 'none';
        });
    }
};

// Handle logout functionality
document.addEventListener('DOMContentLoaded', () => {
    const logoutLink = document.querySelector('#logoutLink');
    logoutLink.addEventListener('click', () => {
        // Perform logout logic
        // Redirect to login page
        window.location.href = 'frontend/web/login.html';
    });

    // Load users on page load
    // loadUsers();
});
