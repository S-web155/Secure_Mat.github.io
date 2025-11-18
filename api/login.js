// api/login.js — Vercel serverless function
const mysql = require('mysql2/promise');
const bcryptjs = require('bcryptjs');

const dbConfig = {
  host: process.env.DB_HOST || 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 4000,
  user: process.env.DB_USER || 'vHxJTKoqWKEPjkX.root',
  password: process.env.DB_PASSWORD || 'fTBN483SmB67BKT7',
  database: process.env.DB_NAME || 'securemat_db',
  ca : process.env.DB_CA || 'certificate/isgrootx1.pem',
};

if (process.env.DB_CA) {
  dbConfig.ssl = { ca: process.env.DB_CA };
}

async function login(req, res) {
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

  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email format' });
  }

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    // Query user
    const [users] = await connection.execute('SELECT id, email, password, first_name FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      connection.end();
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const user = users[0];

    // Verify password
    const passwordMatch = await bcryptjs.compare(password, user.password);
    if (!passwordMatch) {
      connection.end();
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    connection.end();

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.first_name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Login failed: ' + error.message });
  }
}

module.exports = login;
