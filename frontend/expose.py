import os
import uuid
import logging
from frontend.database import Database
import base64 
from cryptography.fernet import Fernet
from kyber_py.src.kyber_py.ml_kem.ml_kem import ML_KEM
import hashlib

params = {
    "k": 3,
    "eta_1": 3,
    "eta_2": 2,
    "du": 10,
    "dv": 4,
}
kem = ML_KEM(params)
fernet_key = os.environ.get("FERNET_SECRET")  # Must be set in your environment
cipher = Fernet(fernet_key)

class Exposed:
    def __init__(self):
        self.db = Database()
        self.upload_folder = os.path.join(os.getcwd(), 'uploads/profile_pictures')
        self.dk_folder = os.path.join(os.getcwd(), 'secrets/dk')
        os.makedirs(self.upload_folder, exist_ok=True)
        os.makedirs(self.dk_folder, exist_ok=True)

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

            # Generate encryption & decryption keys
            ek, dk = kem.keygen()
            logging.debug(f"Generated encryption key for {email}")

            # Save encrypted dk to a secure file
            encrypted_dk = cipher.encrypt(dk)
            dk_file_path = os.path.join(self.dk_folder, f"dk_{email}.bin")
            with open(dk_file_path, "wb") as dk_file:
                dk_file.write(encrypted_dk)
            logging.info(f"Decryption key securely saved at {dk_file_path}")

            # Insert into the database
            query = """
            INSERT INTO public.users (fullname, email, password, profile_picture, ek)
            VALUES (%s, %s, %s, %s, %s)
            """
            result = self.db.execute_update(query, (fullname, email, password, profile_picture_path, ek))
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
                    "profile_picture_url": f"/static/profile_pictures/{user[3]}",
                    "ek": user[6],
                }
                user_list.append(user_dict)
            return {"status": "success", "users": user_list}
        except Exception as e:
            logging.error(f"Error fetching users: {e}")
            return {"status": "error", "message": str(e)}
        
    def create_shared_secret(self, ek):
        # Remove \x from the string and decode it
        hex_string = ek.replace(r'\x', '')
        decoded_bytes = bytes.fromhex(hex_string)
    
        # Use decoded_bytes directly for encapsulation
        k, c = kem.encaps(decoded_bytes)
    
        # Convert to hex strings to make them JSON serializable
        return k.hex(), c.hex()
    
    def decrypt_cipher(self, dk, cipher):
        
        hex_string = cipher.replace(r'\x', '')
        decoded_bytes = bytes.fromhex(hex_string)
        k_prime = kem.decaps(dk, decoded_bytes)
        
        return k_prime.hex()
    
    def encrypt_message(self, shared_secret: str, message: str) -> str:
        """
        Encrypt a message using AES (via Fernet) with the given shared secret.

        Args:
            shared_secret (str): The secret key from ML-KEM used to derive AES key.
            message (str): The plaintext message to encrypt.

        Returns:
            str: Encrypted message (Base64-encoded string).
        """
        # Derive a 32-byte key from the shared secret using SHA256
        derived_key = hashlib.sha256(shared_secret.encode()).digest()

        # Fernet requires a base64-encoded key
        fernet_key = base64.urlsafe_b64encode(derived_key)

        # Create Fernet cipher
        fernet = Fernet(fernet_key)

        # Encrypt the message
        encrypted_message = fernet.encrypt(message.encode())

        return encrypted_message.decode()
    
    def decrypt_message(self, shared_secret: str, encrypted_message: str) -> str:
        """
        Decrypt a message using AES (via Fernet) with the given shared secret.

        Args:
            shared_secret (str): The secret key used during encryption.
            encrypted_message (str): The base64-encoded encrypted message.

        Returns:
            str: The original decrypted plaintext message.
        """
        try:
            # Derive the same 32-byte key from the shared secret
            derived_key = hashlib.sha256(shared_secret.encode()).digest()

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
