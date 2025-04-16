import psycopg2
import psycopg2.extras
import logging

class Database:
    def __init__(self):
        try:
            self.connection = psycopg2.connect(
                dbname="enigma_db",
                user="enigma_user",
                password="has27san",
                host="localhost",  # Or your DB host
                port="5432"
            )
            self.connection.autocommit = True  # Optional: good for small apps
            logging.info("Database connection established.")
        except Exception as e:
            logging.error(f"Error connecting to database: {e}")
            raise
              
    def execute_query(self, query, params=None):
        try:
            with self.connection.cursor(cursor_factory=psycopg2.extras.DictCursor) as cursor:
                cursor.execute(query, params)
                result = cursor.fetchall()
                return result
        except Exception as e:
            logging.error(f"Query failed: {e}")
            return None

    def execute_update(self, query, params=None):
        try:
            with self.connection.cursor() as cursor:
                cursor.execute(query, params)
                return True
        except Exception as e:
            logging.error(f"Update failed: {e}")
            return False

    def close(self):
        if self.connection:
            self.connection.close()
            logging.info("Database connection closed.")
