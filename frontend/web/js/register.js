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
    const profilePictureInput = document.getElementById("profile-picture");
    const profilePictureFile = profilePictureInput.files[0]; // Get the file object
    const profilePicturePath = profilePictureFile?.path || ""; // Get the file path if available

    // Validate passwords
    if (!validatePasswords()) {
        return;
    }

    try {
        // Call the backend via pywebview API with the file path
        const result = await pywebview.api.register_user(
            fullname,
            email,
            password,
            profilePicturePath // Send the file path to the backend
        );

        if (result.status === "success") {
            alert(result.message); // Show success message
            window.location.href = "login.html"; // Redirect to login page
        } else {
            alert(result.message); // Show error message
        }
    } catch (error) {
        console.error("Error during registration:", error);
        alert("An error occurred. Please try again.");
    }
});