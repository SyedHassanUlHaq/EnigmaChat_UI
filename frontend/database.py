import psycopg2
from psycopg2 import pool
import psycopg2.extras
import logging
from frontend.globals import DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD

class Database:
    def __init__(self):
        # Create a connection pool
        self.connection_pool = pool.SimpleConnectionPool(
            1,  # minconn
            10, # maxconn
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
    
    def get_connection(self):
        """Get a connection from the pool"""
        return self.connection_pool.getconn()
    
    def release_connection(self, conn):
        """Release a connection back to the pool"""
        self.connection_pool.putconn(conn)
    
    def execute_query(self, query, params=None):
        """Execute a query and return results"""
        conn = None
        try:
            conn = self.get_connection()
            with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
                print(f"Executing query: {query}")
                print(f"With parameters: {params}")
                cur.execute(query, params or ())
                result = cur.fetchall()
                print(f"Query result: {result}")
                return result
        except Exception as e:
            logging.error(f"Query failed: {e}")
            print(f"Query failed with error: {e}")
            return None
        finally:
            if conn:
                self.release_connection(conn)
    
    def execute_update(self, query, params=None):
        """Execute an update query and return success status"""
        conn = None
        try:
            conn = self.get_connection()
            with conn.cursor() as cur:
                cur.execute(query, params or ())
                conn.commit()
                return True
        except Exception as e:
            logging.error(f"Update failed: {e}")
            return False
        finally:
            if conn:
                self.release_connection(conn)
    
    def close(self):
        """Close all connections in the pool"""
        if hasattr(self, 'connection_pool'):
            self.connection_pool.closeall()
            logging.info("Database connection closed.")
