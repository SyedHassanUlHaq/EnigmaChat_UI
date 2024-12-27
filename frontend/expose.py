import os
import uuid
import logging
from database import Database
import base64 

class Exposed:
    def __init__(self):
        self.db = Database()
        self.upload_folder = os.path.join(os.getcwd(), 'uploads/profile_pictures')
        os.makedirs(self.upload_folder, exist_ok=True)  # Ensure upload folder exists

    def authenticate_user(self, username, password):
        query = "SELECT * FROM users WHERE email = %s AND password = crypt(%s, password)"
        result = self.db.execute_query(query, (username, password))
        if result:
            logging.info(f"User {username} authenticated successfully.")
            return {"status": "success", "message": "Login successful"}
        else:
            logging.warning(f"Authentication failed for user {username}.")
            return {"status": "error", "message": "Invalid credentials"}


    def register_user(self, fullname, email, password, profile_picture_data):
        try:
            # Save profile picture
            picture_name = f"{uuid.uuid4().hex}.png"
            picture_path = os.path.join(self.upload_folder, picture_name)

            # Check and strip Base64 prefix if necessary
            if isinstance(profile_picture_data, str):
                if profile_picture_data.startswith("data:image"):
                    profile_picture_data = profile_picture_data.split(",")[1]  # Remove the data URI prefix
                profile_picture_data = base64.b64decode(profile_picture_data.encode("utf-8"))  # Ensure bytes

            with open(picture_path, "wb") as f:
                f.write(profile_picture_data)

            # Insert user into the database
            query = """
            INSERT INTO users (fullname, email, password, profile_picture)
            VALUES (%s, %s, crypt(%s, gen_salt('bf')), %s)
            """
            self.db.execute_update(query, (fullname, email, password, picture_name))
            logging.info(f"User {email} registered successfully.")
            return {"status": "success", "message": "Registration successful"}
        except Exception as e:
            logging.error(f"Error registering user {email}: {e}")
            return {"status": "error", "message": str(e)}

    def close(self):
        self.db.close()
