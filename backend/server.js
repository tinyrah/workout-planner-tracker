const express = require('express');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const app = express();
const port = 4000;
require('dotenv').config();

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

const createUsersTable = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          hashed_password VARCHAR(60) NOT NULL
        );
      `);
      console.log('Created users table');
      resolve();
    } catch (err) {
      console.error(err.message);
      reject(err);
    }
  });
};

const testInsert = async () => {
  try {
    const testUser = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'testpassword'
    };
    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    const newUser = await pool.query(`
      INSERT INTO users (username, email, hashed_password)
      VALUES ($1, $2, $3)
      RETURNING *;
    `, [testUser.username, testUser.email, hashedPassword]);
    console.log(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
};

createUsersTable().then(testInsert);

app.use(express.json());
app.get('/', async (req, res) => {
  try {
    const testQuery = await pool.query('SELECT NOW()');
    res.json(testQuery.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(`
      INSERT INTO users (username, email, hashed_password)
      VALUES ($1, $2, $3)
      RETURNING *;
    `, [username, email, hashedPassword]);
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});