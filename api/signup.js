// api/signup.js — Vercel serverless function
const mysql = require('mysql2/promise');
const bcryptjs = require('bcryptjs');

const dbConfig = {
  host: process.env.DB_HOST || 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 4000,
  user: process.env.DB_USER || 'vHxJTKoqWKEPjkX.root',
  password: process.env.DB_PASSWORD || 'G5gWxk8srD2rtret',
  database: process.env.DB_NAME || 'test',
  ca : process.env.DB_CA || '/etc/ssl/certs/ca-certificates.crt',
};

// If a CA certificate is provided (e.g. TiDB Cloud), attach it to SSL options
if (process.env.DB_CA) {
  dbConfig.ssl = { ca: process.env.DB_CA };
}

async function signup(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { email, password, first_name, last_name } = req.body;

  // Validation
  if (!email || !password || !first_name) {
    return res.status(400).json({ success: false, message: 'Email, password, and name required' });
  }

  // Email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email format' });
  }

  if (password.length < 8) {
    return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
  }

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    // Check if email exists
    const [existingUsers] = await connection.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      connection.end();
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Insert user
    await connection.execute(
      'INSERT INTO users (email, password, first_name, last_name) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, first_name, last_name || '']
    );

    connection.end();
    return res.status(200).json({ success: true, message: 'Account created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ success: false, message: 'Registration failed: ' + error.message });
  }
}

module.exports = signup;
