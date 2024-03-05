const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { createUser, getUserById, getUser } = require('../db');
const { requireUser } = require('./util');
const JWT_SECRET = process.env.JWT_SECRET;


// POST /api/login
router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  // Check if both username and password are provided
  if (!username || !password) {
    return next({
      name: 'MissingCredentialsError',
      message: 'Please supply both a username and password'
    });
  }

  try {
    // Attempt to retrieve user from the database
    const user = await getUser({ username, password });

    // If user does not exist or password is incorrect, return an error
    if (!user) {
      return next({
        name: 'IncorrectCredentialsError',
        message: 'Username or password is incorrect',
      });
    }

    // Generate JWT token for authentication
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1w' });

    // Send successful response with user data and token
    res.status(200).json({ user, message: "You're logged in!", token });
  } catch (error) {
    next(error);
  }
});

// POST /api/register
router.post('/register', async (req, res) => {
  try {
    // Extract user data from the request body
    const { email, username, password, firstname, lastname, housenum, street, city, state, country, zipcode, phone } = req.body;

    // Check if all required fields are provided
    if (!email || !username || !password || !firstname || !lastname) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Call the createUser function to create the user
    const newUser = await createUser({ email, username, password, firstname, lastname, housenum, street, city, state, country, zipcode, phone });

    // Send a success response with the newly created user data
    res.status(201).json({ user: newUser, message: 'User created successfully' });
  } catch (error) {
    // Handle specific errors
    if (error.name === 'UserExistsError') {
      return res.status(409).json({ error: 'User with this username already exists' });
    }
    // Send an error response for other errors
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/user/:userId
router.get('/:userId', requireUser, async (req, res) => {
  try {
    const userId = req.params.userId; // Extract the user ID from the request parameters
    const user = await getUserById(userId); // Call the getUserById function to fetch the user data
    if (!user) {
      return res.status(404).json({ error: 'User not found' }); // Return a 404 error if the user is not found
    }
    res.json(user); // Return the user data in the response
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ error: 'Internal server error' }); // Return a 500 error for internal server errors
  }
});

module.exports = router;