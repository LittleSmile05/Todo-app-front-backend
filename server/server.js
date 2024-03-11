const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 3000;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.use(express.json());
app.use(express.static('public'));

app.get('/todos', async (req, res) => {
    const result = await pool.query('SELECT * FROM todos ORDER BY id');
    res.json(result.rows);
});

app.post('/todos', async (req, res) => {
    const { task } = req.body;
    const result = await pool.query('INSERT INTO todos (task) VALUES ($1) RETURNING *', [task]);
    res.json(result.rows[0]);
});

app.put('/todos/:id', async (req, res) => {
    const { id } = req.params;
    const result = await pool.query('UPDATE todos SET completed = NOT completed WHERE id = $1 RETURNING *', [id]);
    res.json(result.rows[0]);
});

app.delete('/todos/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM todos WHERE id = $1', [id]);
    res.status(204).end();
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
