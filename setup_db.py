import psycopg2
from psycopg2 import sql
from globals import host, database, user, password, port

def setup_database_and_tables():
    # First connect to postgres database to create our database
    try:
        connection = psycopg2.connect(
            dbname="postgres",  # Connect to default postgres database
            user=user,
            password=password,
            host=host,
            port=port
        )
        connection.autocommit = True
        cursor = connection.cursor()

        # Create database if it doesn't exist
        cursor.execute(f"SELECT 1 FROM pg_database WHERE datname = '{database}'")
        exists = cursor.fetchone()
        if not exists:
            cursor.execute(f'CREATE DATABASE {database}')
            print(f"Database '{database}' created successfully.")
        
        cursor.close()
        connection.close()

        # Now connect to our database and create tables
        connection = psycopg2.connect(
            dbname=database,
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
                password_hash VARCHAR(255) NOT NULL,
                profile_picture VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_typing BOOLEAN DEFAULT FALSE,
                last_typing TIMESTAMP
            )
        """)
        print("Table 'users' created successfully.")

        # Create messages table if it doesn't exist
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                sender_id INTEGER REFERENCES users(id) NOT NULL,
                recipient_id INTEGER REFERENCES users(id) NOT NULL,
                content TEXT NOT NULL,
                status VARCHAR(20) DEFAULT 'sent',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT different_sender_recipient CHECK (sender_id != recipient_id)
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
            CREATE INDEX IF NOT EXISTS idx_messages_sender_recipient 
            ON messages(sender_id, recipient_id)
        """)
        print("Index on messages(sender_id, recipient_id) created successfully.")

    except Exception as e:
        print(f"Error while creating database and tables: {e}")
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'connection' in locals():
            connection.close()

if __name__ == "__main__":
    setup_database_and_tables()
