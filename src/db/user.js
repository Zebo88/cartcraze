const client = require('./client');
const bcrypt = require('bcrypt');
const SALT_COUNT = 10;


// database functions for user

async function createUser({ email, username, password, firstname, lastname, housenum, street, city, state, country, zipcode, phone }) {
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  try {
    const { rows } = await client.query(`
        INSERT INTO users(email, username, password, firstname, lastname, housenum, street, city, state, country, zipcode, phone)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (username) DO NOTHING 
        RETURNING *;
    `, [email, username, hashedPassword, firstname, lastname, housenum, street, city, state, country, zipcode, phone]);

    // Check if any rows were returned
    if (rows.length > 0) {
      // Return the first row (the newly created user)
      return rows[0];
    } else {
      // Handle the case where no rows were returned
      throw new Error("User with this username already exists");
    }
  } catch (error) {
    // Throw a more specific error or handle the case more gracefully
    console.error('Error in createUser:', error.message);
    throw error;
  }
}

async function getUser({ username, password }) {
  try {
    // Check if username and password are provided
    if (!username || !password) {
      throw new Error('Username and password are required');
    }

    // Retrieve user by username from the database
    const user = await getUserByUsername(username);

    // If user doesn't exist, return an error
    if (!user) {
      throw new Error('User not found');
    }

    // Compare hashed password with the provided password
    const passwordsMatch = await bcrypt.compare(password, user.password);

    // If passwords don't match, return an error
    if (!passwordsMatch) {
      throw new Error('Incorrect password');
    }

    // Remove password from the user object before returning
    delete user.password;

    // Return the user object
    return user;
  } catch (error) {
    // Handle errors gracefully
    console.error('Error in getUser:', error.message);
    throw error;
  }
}

async function getUserById(userId) {
  // first get the user
  try {
    const {rows: [user]} = await client.query(`
      SELECT *
      FROM users
      WHERE user_id = $1;
    `, [userId]);
    // if it doesn't exist, return null
    if (!user) return null;
    // if it does:
    // delete the 'password' key from the returned object
    delete user.password; 
    return user;  
  } catch (error) {
    throw error;
  }
}

async function getUserByUsername(userName) {
  // first get the user
  try {
    const {rows} = await client.query(`
      SELECT *
      FROM users
      WHERE username = $1;
    `, [userName]);
    // if it doesn't exist, return null
    if (!rows || !rows.length) return null;
    // if it does:
    // delete the 'password' key from the returned object
    const [user] = rows;
    // delete user.password;
    return user;
  } catch (error) {
    console.error(error)
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}