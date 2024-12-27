function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
}

const loginForm = document.getElementById('Login-form');
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const email = document.getElementById('email').value; // Change to 'email'
    const password = document.getElementById('password').value;

    try {
        const result = await pywebview.api.authenticate_user(email, password);  // Pass 'email'
        alert(result.message);
        if (result.status === 'success') {
            window.location.href = "main.html"; // Redirect to next page after successful login
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred. Please try again.');
    }
});
