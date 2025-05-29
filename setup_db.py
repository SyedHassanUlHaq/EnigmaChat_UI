import psycopg2
from psycopg2 import sql
from globals import host, database, user, password, port

def setup_database_and_tables():
    try:
        # Connect directly to the enigma_ui database
        connection = psycopg2.connect(
            dbname="enigma_ui",
            user=user,
            password=password,
            host=host,
            port=port
        )
        connection.autocommit = True
        cursor = connection.cursor()

        # Create users table if it doesn't exist
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                fullname VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password TEXT NOT NULL,
                profile_picture BYTEA,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_login TIMESTAMP,
                is_online BOOLEAN DEFAULT FALSE
            )
        """)
        print("Table 'users' created successfully.")

        # Create messages table if it doesn't exist
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                sender_id INTEGER REFERENCES users(id) NOT NULL,
                receiver_id INTEGER REFERENCES users(id) NOT NULL,
                encrypted_content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_read BOOLEAN DEFAULT FALSE,
                CONSTRAINT different_sender_receiver CHECK (sender_id != receiver_id)
            )
        """)
        print("Table 'messages' created successfully.")

        # Create index on email for faster lookups
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
        """)
        print("Index on users.email created successfully.")

        # Create index on messages for faster retrieval
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_messages_sender_receiver 
            ON messages(sender_id, receiver_id)
        """)
        print("Index on messages(sender_id, receiver_id) created successfully.")

    except Exception as e:
        print(f"Error while creating tables: {e}")
    finally:
        if connection:
            cursor.close()
            connection.close()

if __name__ == "__main__":
    setup_database_and_tables()
