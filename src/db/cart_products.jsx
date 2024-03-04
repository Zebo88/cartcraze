const client = require('./client');

// Define the function to create a cart product
async function createCartProduct({ cartId, productId, quantity }) {
  try {
    const { rows } = await client.query(`
      INSERT INTO cartProducts(cart_id, product_id, quantity)
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
        UPDATE cartProducts
        SET ${util.dbFields(toUpdate).insert}
        WHERE id = ${id}
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
      DELETE FROM cartProducts
      WHERE id = $1
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
  updateCartProduct,
  deleteCartProduct
};