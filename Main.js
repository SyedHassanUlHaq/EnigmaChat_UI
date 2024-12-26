// Function to toggle the dropdown menu
function toggleDropdown(id) {
    const dropdown = document.getElementById(id);
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

// Function to handle opening a user's chat dynamically
function openChat(userElement) {
    // Extract data from the clicked user element
    const userId = userElement.getAttribute('data-user-id');
    const userName = userElement.getAttribute('data-user-name');
    const userAvatar = userElement.getAttribute('data-user-avatar');

    // Update the chat header with the selected user's name and avatar
    const chatHeader = document.querySelector('.chat-header');
    const chatBody = document.querySelector('.chat-body');
    
    chatHeader.querySelector('h5').textContent = userName;
    chatHeader.querySelector('img').src = userAvatar;
    
    // Optionally, clear the previous chat messages in the chat body
    chatBody.innerHTML = ''; // Clear existing messages

    // Add the placeholder messages or load messages specific to this user
    const messages = [
        { text: 'Lorem ipsum is typically a corrupted version of De finibus bonorum et malorum.', type: 'received' },
        { text: 'Lorem ipsum is typically a corrupted version of De finibus bonorum et malorum.', type: 'sent' }
    ];

    // Append messages dynamically based on the user
    messages.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', message.type);
        messageDiv.innerHTML = `${message.text} <div class="label">${message.type === 'sent' ? 'Message sent' : 'Message received'}</div><div class="encrypted">\xb7\xcb\xc8\x03*\xaa\xb0</div>`;
        chatBody.appendChild(messageDiv);
    });
}

// Event listener for when the user clicks on a user in the sidebar
document.querySelectorAll('.sidebar .user').forEach(user => {
    user.addEventListener('click', () => {
        openChat(user); // Pass the clicked user element to openChat function
    });
});

// Close the dropdown when clicking outside
window.onclick = function(event) {
    if (!event.target.closest('.logged-in-user') && !event.target.closest('.user')) {
        document.querySelectorAll('.dropdown-content').forEach(dropdown => {
            dropdown.style.display = 'none';
        });
    }
}
