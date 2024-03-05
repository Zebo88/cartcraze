const client = require('./client');

// Define the function to create a cart product
async function createCartProduct({ cartId, productId, quantity }) {
  try {
    const { rows } = await client.query(`
      INSERT INTO cart_products(cart_id, product_id, quantity)
      VALUES ($1, $2, $3)
      RETURNING *;
    `, [cartId, productId, quantity]);

    // Check if any rows were returned
    if (rows.length > 0) {
      // Return the first row (the newly created cart product)
      return rows[0];
    } else {
      // Handle the case where no rows were returned
      throw new Error("No rows returned after cart product creation");
    }
  } catch (error) {
    throw error;
  }
}

async function getCartProductsByCartId(cartId) {
  try {
      const { rows } = await client.query(`
          SELECT * FROM cart_products WHERE cart_id = $1;
      `, [cartId]);

      return rows; // Return all cart products associated with the provided cartId
  } catch (error) {
      throw error;
  }
}

// Define the function to update a cart product
async function updateCartProduct({ id, ...fieldsToUpdate }) {
  try {
    const toUpdate = {};
    for (let column in fieldsToUpdate) {
      if (fieldsToUpdate[column] !== undefined) toUpdate[column] = fieldsToUpdate[column];
    }

    let cartProduct;
    if (Object.keys(toUpdate).length > 0) {
      const { rows } = await client.query(`
        UPDATE cart_products
        SET ${util.dbFields(toUpdate).insert}
        WHERE cart_product_id = ${id}
        RETURNING *;
      `, Object.values(toUpdate));
      cartProduct = rows[0];
    }
    return cartProduct;
  } catch (error) {
    throw error;
  }
}

// Define the function to delete a cart product
async function deleteCartProduct(id) {
  try {
    const { rows } = await client.query(`
      DELETE FROM cart_products
      WHERE cart_product_id = $1
      RETURNING *;
    `, [id]);

    // Check if any rows were returned
    if (rows.length > 0) {
      // Return the first row (the deleted cart product)
      return rows[0];
    } else {
      // Handle the case where no rows were returned
      throw new Error("No rows returned after cart product deletion");
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createCartProduct,
  getCartProductsByCartId,
  updateCartProduct,
  deleteCartProduct
};