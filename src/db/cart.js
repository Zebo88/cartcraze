import client from './client.js';


async function getCurrentDate() {
  return new Date().toISOString().split('T')[0]; // Returns a date string in the format 'YYYY-MM-DD'
}

async function createCart(userId) {
  try {
    // Retrieve the current date
    const currentDate = await getCurrentDate();
    
    // Check if currentDate is valid
    if (!currentDate || !userId) {
      throw new Error('Failed to get the current date');
    }

    const { rows } = await client.query(`
      INSERT INTO carts(user_id, date)
      VALUES ($1, $2)
      RETURNING *;
    `, [userId, currentDate]);

    return rows[0];
  } catch (error) {
    throw new Error(`Error creating cart: ${error.message}`);
  }
}

async function getCartByUserId(userId) {
  try {
      const { rows: cartRows } = await client.query(
          `SELECT * FROM carts WHERE user_id = $1;`,
          [userId]
      );

      if (cartRows.length === 0) {
          return null; // Return null if no cart is found
      }

      return cartRows[0]; // Retrieve the first cart found
  } catch (error) {
      throw error;
  }
}

async function getCartItemsByCartId(cartId) {
  try {
      const query = `
          SELECT * FROM cart_products
          WHERE cart_id = $1;
      `;
      const { rows } = await client.query(query, [cartId]);
      return rows;
  } catch (error) {
    throw new Error(`Error fetching cart items for cart ID ${cartId}: ${error.message}`);
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

export {
  getCurrentDate,
  createCart,
  getCartByUserId,
  getCartItemsByCartId,
  deleteCart
};