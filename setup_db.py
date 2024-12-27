import psycopg2
from psycopg2 import sql
from globals import host, database, user, password, port

def setup_database_and_tables():
    try:
        # Connect to PostgreSQL server and create the database if it doesn't exist
        connection = psycopg2.connect(
            dbname="postgres",  # Connect to the default 'postgres' database
            user=user,
            password=password,
            host=host,
            port=port
        )
        connection.autocommit = True
        cursor = connection.cursor()

        # Create the project database if it doesn't exist
        cursor.execute(sql.SQL("SELECT 1 FROM pg_catalog.pg_database WHERE datname = %s"), ['enigma_ui'])
        exists = cursor.fetchone()
        if not exists:
            cursor.execute(sql.SQL("CREATE DATABASE enigma_ui"))
            print("Database 'enigma_ui' created successfully.")
        else:
            print("Database 'enigma_ui' already exists. Skipping creation.")
        
        # Now connect to the enigma_ui database
        connection.close()  # Close the previous connection to switch to the new one
        connection = psycopg2.connect(
            dbname="enigma_ui",
            user=user,
            password=password,
            host=host,
            port=port
        )
        cursor = connection.cursor()

        # Create users table if it doesn't exist
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                fullname VARCHAR(100),
                email VARCHAR(100) UNIQUE,
                password TEXT,
                profile_picture BYTEA,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        print("Table 'users' created successfully.")
    except Exception as e:
        print(f"Error while creating database or tables: {e}")
    finally:
        if connection:
            cursor.close()
            connection.close()

setup_database_and_tables()
