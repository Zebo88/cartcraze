// Import the required modules
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import chalk from 'chalk';

// Configure dotenv
dotenv.config();

// Initialize the Express server
const server = express();

// Connect to the server
const { PORT = 10000 } = process.env;

// Bring in the DB connection
import client from './src/db/client.js';
client.connect();

// Middleware setup
server.use(cors());
server.use(morgan('dev'));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Router: /api
import router from './src/api/index.js';
server.use('/api', router);

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