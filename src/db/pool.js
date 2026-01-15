import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.warn("⚠️  DATABASE_URL is not set. Check your .env file.");
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});