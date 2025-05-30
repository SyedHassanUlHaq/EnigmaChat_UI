function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
}

function validateForm() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert('Please fill in all fields');
        return false;
    }

    if (!email.includes('@')) {
        alert('Please enter a valid email address');
        return false;
    }

    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return false;
    }

    return true;
}

const loginForm = document.getElementById('Login-form');
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const result = await pywebview.api.authenticate_user(email, password);
        console.log("result: ", result)
        if (result.status === 'success') {
            window.location.href = "main.html";
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred. Please try again.');
    }
});
