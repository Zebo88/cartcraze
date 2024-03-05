const client = require('./client');


async function createCart({ userId, date }) {
  try {
      const { rows } = await client.query(`
          INSERT INTO carts(user_id, date)
          VALUES ($1, $2)
          RETURNING *;
      `, [userId, date]);
      return rows[0];
  } catch (error) {
      throw error;
  }
}

async function getCartByUserId(userId) {
  try {
      const { rows } = await client.query(`
          SELECT * FROM carts WHERE user_id = $1;
      `, [userId]);

      if (rows.length === 0) {
          return null; // Return null if no cart is found
      }

      return rows[0]; // Return the first cart found (assuming there's only one per user)
  } catch (error) {
      throw error;
  }
}

async function updateCart({ cartId, ...fields }) {
  try {
      const setFields = Object.keys(fields).map((key, index) => `"${key}"=$${index + 2}`).join(', ');
      const values = Object.values(fields);
      values.push(cartId);
      const { rows } = await client.query(`
          UPDATE carts
          SET ${setFields}
          WHERE cart_id = $1
          RETURNING *;
      `, values);
      return rows[0];
  } catch (error) {
      throw error;
  }
}

async function deleteCart(cartId) {
  try {
      const { rows } = await client.query(`
          DELETE FROM carts
          WHERE cart_id = $1
          RETURNING *;
      `, [cartId]);
      return rows[0];
  } catch (error) {
      throw error;
  }
}

module.exports = {
  createCart,
  getCartByUserId,
  updateCart,
  deleteCart
}