import express from 'express';
import { pool } from '../db/db.js';
import {PORT} from '../src/config.js';

const app = express();
const port = PORT;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/ping', async (req, res) => {
  try {
    const [result]= await pool.query('SELECT "Hello world" AS RESULT');
    res.json(result);
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).send('Database connection error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/users', async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM usuario');
    res.json(result);
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).send('Database connection error');
  }
});

//login morgan winston bunyan pino log4js