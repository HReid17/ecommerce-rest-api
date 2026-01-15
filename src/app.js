import express from 'express';
import dotenv from 'dotenv';
import { pool } from './db/pool.js'

dotenv.config()

const app = express();

app.use(express.json());

// API Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// DB health check
app.get("/db-health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() as now;");
    res.json({ db: "ok", now: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ db: "error" });
  }
});


export default app;