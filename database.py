import psycopg2
from psycopg2.extras import RealDictCursor
from globals import host, database, user, password, port

class Database:
    def __init__(self):
        self.connection = psycopg2.connect(
            host=host,
            database=database,
            user=user,
            password=password,
            port= port
        )
        self.connection.autocommit = True
        self.cursor = self.connection.cursor(cursor_factory=RealDictCursor)

    def execute_query(self, query, params=None):
        try:
            self.cursor.execute(query, params)
            return self.cursor.fetchall()
        except Exception as e:
            print(f"Error executing query: {e}")
            return None

    def execute_update(self, query, params=None):
        try:
            self.cursor.execute(query, params)
        except Exception as e:
            print(f"Error executing update: {e}")

    def close(self):
        self.cursor.close()
        self.connection.close()

# Example usage:
# db = Database('localhost', 'enigma_ui', 'username', 'password')
# result = db.execute_query("SELECT * FROM users WHERE username = %s", ('example_user',))
# db.close()
