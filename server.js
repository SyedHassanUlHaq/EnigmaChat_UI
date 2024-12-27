const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Database configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'EnigmaChat', // Replace with your database name
  password: 'owaiskuttapru5', // Replace with your database password
  port: 5432,
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// File upload configuration
const upload = multer({ storage: multer.memoryStorage() });

// Serve static files (HTML, CSS)
app.use(express.static(__dirname));

// Handle registration
app.post('/register', upload.single('profile_picture'), async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    const profilePicture = req.file ? req.file.buffer : null;

    const query = `
      INSERT INTO public."Registeration" (full_name, email_or_phone, password, profile_picture, created_at)
      VALUES ($1, $2, $3, $4, NOW())
    `;

    await pool.query(query, [fullname, email, password, profilePicture]);

    // Redirect to login page
    res.redirect('/login.html');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred during registration.');
  }
});

// Handle login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Query to check for matching email/phone and password
    const query = `
      SELECT * 
      FROM public."Registeration"
      WHERE email_or_phone = $1 AND password = $2
    `;

    const result = await pool.query(query, [email, password]);

    if (result.rows.length > 0) {
      // Successful login, redirect to Main.html
      res.redirect('/Main.html');
    } else {
      // Invalid credentials, show error message
      res.send(`
        <script>
          alert("Incorrect email or password.");
          window.location.href = "/login.html";
        </script>
      `);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred during login.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
