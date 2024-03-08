// Import the required modules
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import chalk from 'chalk';

// Configure dotenv
dotenv.config();

// Initialize the Express server
const server = express();

// Connect to the server
const { PORT = 3000 } = process.env;

// Bring in the DB connection
import client from './src/db/client.js';
client.connect();

// Middleware setup
server.use(cors());
server.use(morgan('dev'));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// // Serve Docs
// const __dirname = path.dirname(new URL(import.meta.url).pathname);
// server.use('/docs', express.static(path.join(__dirname, 'public')));

// Router: /api
import apiRouter from './src/api/index.js';
server.use('/api', apiRouter);

// 404 handler
server.get('*', (req, res) => {
  res.status(404).send({ error: '404 - Not Found', message: 'No route found for the requested URL' });
});

// Error handling middleware
server.use((error, req, res, next) => {
  console.error('SERVER ERROR: ', error);
  if (res.statusCode < 400) res.status(500);
  res.send({ error: error.message, name: error.name, message: error.message, table: error.table });
});

// Start the server
server.listen(PORT, async () => {
  console.log(chalk.blueBright('Server is listening on PORT:'), chalk.yellow(PORT), chalk.blueBright('Time to go shopping!'));
});