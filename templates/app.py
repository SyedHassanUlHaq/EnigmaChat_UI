from flask import Flask, render_template, request, redirect, url_for
import psycopg2
from psycopg2 import sql
import os
from werkzeug.utils import secure_filename
import datetime

app = Flask(__name__)

# Database connection setup
def get_db_connection():
    conn = psycopg2.connect(
        host="localhost",  # Change to your DB host if needed
        database="EnigmaChat",  # Replace with your database name
        user="your_username",  # Replace with your PostgreSQL username
        password="your_password"  # Replace with your PostgreSQL password
    )
    return conn

# Configuration for file upload
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif'}

# Function to check allowed file extensions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# Route for home page (root URL)
@app.route('/')
def home():
    return render_template('home.html')  # Make sure you have a home.html template

# Route for registration
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        full_name = request.form['fullname']
        email_or_phone = request.form['email']
        password = request.form['password']
        confirm_password = request.form['confirm-password']
        
        # Check if passwords match
        if password != confirm_password:
            return render_template('register_index.html', error="Passwords do not match!")

        # Handle profile picture upload
        profile_picture = None
        if 'profile-picture' in request.files:
            file = request.files['profile-picture']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(file_path)

                # Read the file as binary to store in the database
                with open(file_path, 'rb') as f:
                    profile_picture = f.read()

        # Insert the data into the database
        conn = get_db_connection()
        cur = conn.cursor()

        try:
            # Insert registration data
            query = sql.SQL("INSERT INTO public.\"Registeration\" (full_name, email_or_phone, password, profile_picture, created_at) "
                            "VALUES (%s, %s, %s, %s, %s)")
            cur.execute(query, (full_name, email_or_phone, password, profile_picture, datetime.datetime.now()))
            conn.commit()
        except Exception as e:
            conn.rollback()
            return render_template('register_index.html', error="An error occurred while saving your data.")

        finally:
            cur.close()
            conn.close()

        return redirect(url_for('login'))  # Redirect to login page after successful registration

    return render_template('register_index.html')

# Route for login (for redirect after registration)
@app.route('/login')
def login():
    return render_template('login.html')  # Ensure you have a login.html template for this route

if __name__ == '__main__':
    app.run(debug=True)
