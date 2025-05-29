import os
import uuid
import logging
from frontend.database import Database
import base64 
from cryptography.fernet import Fernet
import hashlib

# The provided encryption key
ENCRYPTION_KEY = "616E0B753A3B7F40FEF9A389F58F16BFBB04622941D2464BDAE767820DFAC38E"

class Exposed:
    def __init__(self):
        self.db = Database()
        self.upload_folder = os.path.join(os.getcwd(), 'uploads/profile_pictures')
        os.makedirs(self.upload_folder, exist_ok=True)

    def authenticate_user(self, username, password):
        print("Heeelllooo")
        query = "SELECT * FROM users WHERE email = %s AND password = %s"
        result = self.db.execute_query(query, (username, password))
        if result:
            logging.info(f"User {username} authenticated successfully.")
            return {"status": "success", "message": "Login successful"}
        else:
            logging.warning(f"Authentication failed for user {username}.")
            return {"status": "error", "message": "Invalid credentials"}

    def register_user(self, fullname, email, password, profile_picture_path):
        try:
            # No need to save the profile picture, just store the path
            logging.debug(f"Using profile picture path for {email}: {profile_picture_path}")

            # Insert into the database
            query = """
            INSERT INTO public.users (fullname, email, password, profile_picture)
            VALUES (%s, %s, %s, %s)
            """
            result = self.db.execute_update(query, (fullname, email, password, profile_picture_path))
            logging.info(f"Insert result for {email}: {result}")

            if result:
                logging.info(f"User {email} registered successfully in database.")
            else:
                logging.warning(f"No rows affected while registering {email}.")

            return {"status": "success", "message": "Registration successful"}

        except Exception as e:
            logging.error(f"Error registering user {email}: {e}")
            return {"status": "error", "message": str(e)}

    def get_all_users(self):
        try:
            query = "SELECT * FROM public.users"
            users = self.db.execute_query(query)
            user_list = []
            for user in users:
                user_dict = {
                    "id": user[0],
                    "fullname": user[1],
                    "email": user[2],
                    "profile_picture_url": f"/static/profile_pictures/{user[3]}"
                }
                user_list.append(user_dict)
            return {"status": "success", "users": user_list}
        except Exception as e:
            logging.error(f"Error fetching users: {e}")
            return {"status": "error", "message": str(e)}
    
    def encrypt_message(self, message: str) -> str:
        """
        Encrypt a message using the provided encryption key.

        Args:
            message (str): The plaintext message to encrypt.

        Returns:
            str: Encrypted message (Base64-encoded string).
        """
        try:
            # Convert the hex key to bytes
            key_bytes = bytes.fromhex(ENCRYPTION_KEY)
            
            # Derive a 32-byte key using SHA256
            derived_key = hashlib.sha256(key_bytes).digest()
            
            # Base64 encode the key for Fernet
            fernet_key = base64.urlsafe_b64encode(derived_key)
            
            # Create Fernet cipher
            fernet = Fernet(fernet_key)
            
            # Encrypt the message
            encrypted_message = fernet.encrypt(message.encode())
            
            return encrypted_message.decode()
        except Exception as e:
            logging.error(f"Failed to encrypt message: {e}")
            return "Encryption failed"
    
    def decrypt_message(self, encrypted_message: str) -> str:
        """
        Decrypt a message using the provided encryption key.

        Args:
            encrypted_message (str): The base64-encoded encrypted message.

        Returns:
            str: The original decrypted plaintext message.
        """
        try:
            # Convert the hex key to bytes
            key_bytes = bytes.fromhex(ENCRYPTION_KEY)
            
            # Derive a 32-byte key using SHA256
            derived_key = hashlib.sha256(key_bytes).digest()
            
            # Base64 encode the key for Fernet
            fernet_key = base64.urlsafe_b64encode(derived_key)
            
            # Create Fernet cipher
            fernet = Fernet(fernet_key)
            
            # Decrypt the message
            decrypted_message = fernet.decrypt(encrypted_message.encode())
            
            return decrypted_message.decode()
        except Exception as e:
            logging.error(f"Failed to decrypt message: {e}")
            return "Decryption failed"

    def close(self):
        self.db.close()
