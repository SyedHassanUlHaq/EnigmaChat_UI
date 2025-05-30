import os
import sys

# Add the parent directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from frontend.expose import Exposed
from frontend.globals import DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD

def reset_database():
    """Reset the database by dropping and recreating tables"""
    api = None
    try:
        # Create an instance of Exposed with database configuration
        api = Exposed()
        
        # Drop existing tables
        print("Dropping existing tables...")
        api.drop_tables()
        
        # Create new tables
        print("Creating new tables...")
        api.create_tables()
        
        print("Database reset completed successfully!")
    except Exception as e:
        print(f"Error resetting database: {str(e)}")
    finally:
        # Close the database connection if api was created
        if api is not None:
            api.db.close()

if __name__ == "__main__":
    reset_database() 