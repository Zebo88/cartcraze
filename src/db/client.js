import pkg from 'pg';
const { Client } = pkg;

const connectionString = process.env.DATABASE_URL || 'https://localhost:5432/cartcraze_db';

const client = new Client({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

export default client;