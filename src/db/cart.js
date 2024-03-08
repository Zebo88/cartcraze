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

// async function updateCart({ cartId, ...fields }) {
//   try {
//       const setFields = Object.keys(fields).map((key, index) => `"${key}"=$${index + 2}`).join(', ');
//       const values = Object.values(fields);
//       values.push(cartId);
//       const { rows } = await client.query(`
//           UPDATE carts
//           SET ${setFields}
//           WHERE cart_id = $1
//           RETURNING *;
//       `, values);
//       return rows[0];
//   } catch (error) {
//       throw error;
//   }
// }
// FUNCTION NOT NECESSARY: the only thing we are doing with the cart is creating one, getting one, and deleting one. 
// KEEPING IN CASE I WANT IT LATER.

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