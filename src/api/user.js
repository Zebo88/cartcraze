import express from 'express';
import jwt from 'jsonwebtoken';
import { createUser, getUserById, getUser, updateUser } from '../db/user.js';
import { requireUser } from './util.js';

const router = express.Router();

// secret key
const JWT_SECRET = 'yankees3DJtheCap';

// POST /api/user/login
router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  // Check if both username and password are provided
  if (!username || !password) {
    return res.status(400).json({
      error: 'MissingCredentialsError',
      message: 'Please supply both a username and password'
    });
  }

  try {
    // Attempt to retrieve user from the database
    const user = await getUser({ username, password });

    // If user does not exist or password is incorrect, return an error
    if (!user) {
      return res.status(401).json({
        error: 'IncorrectCredentialsError',
        message: 'Username or password is incorrect',
      });
    }

    // Generate JWT token for authentication
    const token = jwt.sign({ id: user.user_id, username: user.username }, JWT_SECRET, { expiresIn: '1w' });

    // Set req.user to the retrieved user object
    req.user = user;

    // Send successful response with user data and token
    res.status(200).json({ user, message: "You're logged in!", token });
  } catch (error) {
    next(error);
  }
});

// POST /api/user/register
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

    // Set req.user to the retrieved user object
    req.user = newUser;

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
    req.user = user; //set the user
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ error: 'Internal server error' }); // Return a 500 error for internal server errors
  }
});

// POST /api/user/logout - Log out the user
router.post('/logout', (req, res) => {
  try {
    // Check if the user is logged in
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'You must be logged in to log out'
      });
    }

    // Remove the user information from the request object
    delete req.user;

    // Send a success response
    res.json({ message: 'You have been successfully logged out' });
  } catch (error) {
    console.error('Error logging out user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/user/update/:userId - Update user information
router.patch('/update/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const userData = req.body; // User data to update sent in the request body

    // Call the updateUser function to update user information
    const updatedUser = await updateUser(userId, userData);
    
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
});

export default router;