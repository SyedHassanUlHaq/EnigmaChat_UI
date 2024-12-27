function showPopupMessage(message) {
    alert(message);
}

// Function to validate passwords
function validatePasswords() {
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
        const errorElement = document.getElementById("password-error");
        errorElement.textContent = "Passwords do not match!";
        errorElement.style.display = "block";
        return false; // Prevent form submission
    }

    return true; // Allow form submission
}

// Function to toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    input.type = input.type === "password" ? "text" : "password";
}

// Function to show profile picture preview
function previewProfilePicture(event) {
    const preview = document.getElementById("profile-picture-preview");
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function () {
        preview.src = reader.result;
        preview.style.display = "block"; // Show preview
    };

    if (file) {
        reader.readAsDataURL(file); // Read the file as a data URL
    }
}

// Function to handle form submission
document.querySelector(".register-form").addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent default form submission

    const fullname = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const profilePicture = document.getElementById("profile-picture").files[0];

    // Validate passwords
    if (!validatePasswords()) {
        return;
    }

    try {
        // Read the profile picture as binary data
        const reader = new FileReader();
        reader.onload = async function () {
            const profilePictureData = reader.result.split(",")[1]; // Get the Base64 data

            // Call the backend via pywebview API
            const result = await pywebview.api.register_user(
                fullname, 
                email, 
                password, 
                atob(profilePictureData) // Decode Base64 to binary
            );

            if (result.status === "success") {
                alert(result.message); // Show success message
                window.location.href = "login.html"; // Redirect to login page
            } else {
                alert(result.message); // Show error message
            }
        };

        reader.readAsDataURL(profilePicture); // Read the file as Base64
    } catch (error) {
        console.error("Error during registration:", error);
        alert("An error occurred. Please try again.");
    }
});
