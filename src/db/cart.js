const client = require('./client');


async function createCart({ userId, date }) {
  try {
      const { rows } = await client.query(`
          INSERT INTO carts("userId", date)
          VALUES ($1, $2)
          RETURNING *;
      `, [userId, date]);
      return rows[0];
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
          WHERE id = $1
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
          WHERE id = $1
          RETURNING *;
      `, [cartId]);
      return rows[0];
  } catch (error) {
      throw error;
  }
}

module.exports = {
  createCart,
  updateCart,
  deleteCart
}