import psycopg2
from globals import host, database, user, password, port

def drop_all_tables():
    try:
        # Connect to the database
        connection = psycopg2.connect(
            dbname="enigma_ui",
            user=user,
            password=password,
            host=host,
            port=port
        )
        connection.autocommit = True
        cursor = connection.cursor()

        # Disable foreign key constraints temporarily
        cursor.execute("SET session_replication_role = 'replica';")

        # Get all table names
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        """)
        tables = cursor.fetchall()

        # Drop each table
        for table in tables:
            table_name = table[0]
            print(f"Dropping table: {table_name}")
            cursor.execute(f'DROP TABLE IF EXISTS "{table_name}" CASCADE')
            print(f"Table {table_name} dropped successfully")

        # Re-enable foreign key constraints
        cursor.execute("SET session_replication_role = 'origin';")

        print("\nAll tables have been dropped successfully!")

    except Exception as e:
        print(f"Error while dropping tables: {e}")
    finally:
        if connection:
            cursor.close()
            connection.close()

if __name__ == "__main__":
    # Ask for confirmation before proceeding
    confirmation = input("WARNING: This will drop ALL tables in the database. Are you sure? (yes/no): ")
    if confirmation.lower() == 'yes':
        drop_all_tables()
    else:
        print("Operation cancelled.") 