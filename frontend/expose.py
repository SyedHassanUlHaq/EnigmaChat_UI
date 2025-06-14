import os
import uuid
import logging
from frontend.database import Database
import base64
from cryptography.fernet import Fernet
import hashlib
from datetime import datetime

# Read encryption key from file
with open('out.txt', 'r') as f:
    ENCRYPTION_KEY = f.read().strip()

# Simple in-memory session store
current_user_email = None

class Exposed:
    def __init__(self):
        self.db = Database()
        self.upload_folder = os.path.join(os.getcwd(), 'uploads/profile_pictures')
        os.makedirs(self.upload_folder, exist_ok=True)

    def authenticate_user(self, email, password):
        """Authenticate a user with email and password"""
        try:
            # Hash the password
            password_hash = hashlib.sha256(password.encode()).hexdigest()

            query = "SELECT * FROM users WHERE email = %s AND password_hash = %s"
            print(f"Executing query with email: {email} and password_hash: {password_hash}")
            result = self.db.execute_query(query, (email, password_hash))

            if result:
                # Store the user's email in memory
                global current_user_email
                current_user_email = email
                print(f"Stored current user email: {current_user_email}")
                
                logging.info(f"User {email} authenticated successfully.")
                return {"status": "success", "message": "Login successful"}
            else:
                logging.warning(f"Authentication failed for user {email}.")
                return {"status": "error", "message": "Invalid credentials"}
        except Exception as e:
            logging.error(f"Error during authentication: {str(e)}")
            return {"status": "error", "message": str(e)}

    def register_user(self, fullname, email, password, profile_picture_path):
        """Register a new user"""
        try:
            # Hash the password
            password_hash = hashlib.sha256(password.encode()).hexdigest()

            # Read the public key from file
            with open('key_output.txt', 'r') as f:
                public_key = f.read().strip()

            # Insert into the database
            query = """
            INSERT INTO users (fullname, email, password_hash, profile_picture, public_key)
            VALUES (%s, %s, %s, %s, %s)
            """
            result = self.db.execute_update(query, (fullname, email, password_hash, profile_picture_path, public_key))

            if result:
                logging.info(f"User {email} registered successfully.")
                return {"status": "success", "message": "Registration successful"}
            else:
                logging.warning(f"Registration failed for user {email}.")
                return {"status": "error", "message": "Registration failed"}
        except Exception as e:
            logging.error(f"Error registering user {email}: {str(e)}")
            return {"status": "error", "message": str(e)}

    def get_all_users(self):
        try:
            query = """
            SELECT id, fullname, email, profile_picture, created_at
            FROM users
            """
            users = self.db.execute_query(query)
            user_list = []
            for user in users:
                user_dict = {
                    "id": user[0],
                    "fullname": user[1],
                    "email": user[2],
                    "profile_picture": user[3],
                    "created_at": user[4].isoformat() if user[4] else None
                }
                user_list.append(user_dict)
            return {"status": "success", "users": user_list}
        except Exception as e:
            logging.error(f"Error fetching users: {e}")
            return {"status": "error", "message": str(e)}

    def send_message(self, sender_id, recipient_id, content):
        """Send a message from one user to another"""
        try:
            # Encrypt the message
            encrypted = self.encrypt_message(content)

            conn = None
            try:
                conn = self.db.get_connection()
                with conn.cursor() as cur:
                    # Insert the message
                    cur.execute("""
                        INSERT INTO messages (sender_id, recipient_id, content)
                        VALUES (%s, %s, %s)
                        RETURNING id, created_at
                    """, (sender_id, recipient_id, encrypted))

                    message_id, created_at = cur.fetchone()
                    conn.commit()

                    return {
                        "status": "success",
                        "message_id": message_id,
                        "created_at": created_at.isoformat(),
                        "encrypted_content": encrypted
                    }
            finally:
                if conn:
                    self.db.release_connection(conn)
        except Exception as e:
            print(f"Error sending message: {str(e)}")
            return {"status": "error", "message": str(e)}

    def get_messages(self, user_id, contact_id):
        """Get messages between two users"""
        try:
            conn = None
            try:
                conn = self.db.get_connection()
                with conn.cursor() as cur:
                    # Get messages where user is either sender or recipient
                    cur.execute("""
                        SELECT m.id, m.sender_id, m.recipient_id, m.content, m.created_at, u.fullname
                        FROM messages m
                        JOIN users u ON m.sender_id = u.id
                        WHERE (m.sender_id = %s AND m.recipient_id = %s)
                           OR (m.sender_id = %s AND m.recipient_id = %s)
                        ORDER BY m.created_at ASC
                    """, (user_id, contact_id, contact_id, user_id))

                    messages = []
                    for msg in cur.fetchall():
                        # Decrypt the message
                        decrypted_content = self.decrypt_message(msg[3])

                        message_dict = {
                            "id": msg[0],
                            "content": decrypted_content,
                            "encrypted_content": msg[3],
                            "is_sender": msg[1] == user_id,
                            "sender_name": msg[5],
                            "created_at": msg[4].isoformat()
                        }
                        messages.append(message_dict)

                    return {"status": "success", "messages": messages}
            finally:
                if conn:
                    self.db.release_connection(conn)
        except Exception as e:
            print(f"Error getting messages: {str(e)}")
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

    def drop_tables(self):
        """Drop all existing tables"""
        try:
            with self.get_db_connection() as conn:
                with conn.cursor() as cur:
                    # Drop tables in correct order (due to foreign key constraints)
                    cur.execute("DROP TABLE IF EXISTS messages CASCADE")
                    cur.execute("DROP TABLE IF EXISTS contacts CASCADE")
                    cur.execute("DROP TABLE IF EXISTS users CASCADE")
                    conn.commit()
                    print("Tables dropped successfully")
        except Exception as e:
            print(f"Error dropping tables: {str(e)}")
            raise

    def create_tables(self):
        """Create necessary database tables if they don't exist"""
        try:
            with self.get_db_connection() as conn:
                with conn.cursor() as cur:
                    # Create users table
                    cur.execute("""
                        CREATE TABLE IF NOT EXISTS users (
                            id SERIAL PRIMARY KEY,
                            fullname VARCHAR(100) NOT NULL,
                            email VARCHAR(100) UNIQUE NOT NULL,
                            password_hash VARCHAR(255) NOT NULL,
                            profile_picture VARCHAR(255),
                            public_key TEXT NOT NULL,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                        )
                    """)

                    # Create messages table with recipient_id
                    cur.execute("""
                        CREATE TABLE IF NOT EXISTS messages (
                            id SERIAL PRIMARY KEY,
                            sender_id INTEGER REFERENCES users(id),
                            recipient_id INTEGER REFERENCES users(id),
                            content TEXT NOT NULL,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                        )
                    """)

                    # Create contacts table
                    cur.execute("""
                        CREATE TABLE IF NOT EXISTS contacts (
                            id SERIAL PRIMARY KEY,
                            user_id INTEGER REFERENCES users(id),
                            contact_id INTEGER REFERENCES users(id),
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            UNIQUE(user_id, contact_id)
                        )
                    """)

                    conn.commit()
                    print("Database tables created successfully")
        except Exception as e:
            print(f"Error creating tables: {str(e)}")
            raise

    def get_current_user(self):
        """Get the current user's information"""
        try:
            global current_user_email
            print(f"Getting current user for email: {current_user_email}")
            
            if not current_user_email:
                print("No current user email found")
                return None

            conn = None
            try:
                conn = self.db.get_connection()
                with conn.cursor() as cur:
                    cur.execute("""
                        SELECT id, fullname, email, profile_picture, created_at
                        FROM users
                        WHERE email = %s
                    """, (current_user_email,))

                    user = cur.fetchone()
                    if user:
                        print(f"Found user: {user}")
                        return {
                            "id": user[0],
                            "fullname": user[1],
                            "email": user[2],
                            "profile_picture": user[3],
                            "created_at": user[4].isoformat() if user[4] else None
                        }
                    print("No user found in database")
                    return None
            finally:
                if conn:
                    self.db.release_connection(conn)
        except Exception as e:
            print(f"Error getting current user: {str(e)}")
            return None

    def get_db_connection(self):
        """Get a database connection"""
        return self.db.get_connection()
