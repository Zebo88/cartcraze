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
      throw new Error("No rows returned after user creation");
    }
  } catch (error) {
    throw error;
  }
}

async function getUser({username, password}) {
  if (!username || !password) {
    return;
  }

  try {
    const user = await getUserByUsername(username);
    if(!user) return;
    const hashedPassword = user.password;
    const passwordsMatch = await bcrypt.compare(password, hashedPassword);
    if(!passwordsMatch) return;
    delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  // first get the user
  try {
    const {rows: [user]} = await client.query(`
      SELECT *
      FROM users
      WHERE id = $1;
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