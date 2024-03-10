import client from './client.js';

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
// async function updateCartProduct({ id, ...fieldsToUpdate }) {
//   try {
//     const toUpdate = {};
//     for (let column in fieldsToUpdate) {
//       if (fieldsToUpdate[column] !== undefined) toUpdate[column] = fieldsToUpdate[column];
//     }

//     let cartProduct;
//     if (Object.keys(toUpdate).length > 0) {
//       const { rows } = await client.query(`
//         UPDATE cart_products
//         SET ${util.dbFields(toUpdate).insert}
//         WHERE cart_product_id = ${id}
//         RETURNING *;
//       `, Object.values(toUpdate));
//       cartProduct = rows[0];
//     }
//     return cartProduct;
//   } catch (error) {
//     throw error;
//   }
// } // DECIDED TO GO WITH A MORE SIMPLIFIED APPROACH TO UPDATING. KEEPING IN CASE I WANT IT LATER.

async function updateCartProduct({ cartId, productId, quantity }) {
  try {
    // Check if productId and quantity are provided
    if (productId === undefined || quantity === undefined) {
      throw new Error('productId and quantity are required for updating cart');
    }

    // Update the quantity of the specified product in the cart
    const query = `
      UPDATE cart_products
      SET quantity = $1
      WHERE cart_id = $2 AND product_id = $3
    `;
    await client.query(query, [quantity, cartId, productId]);

    // Return success message or updated cart data
    return { message: 'Cart updated successfully' };
  } catch (error) {
    throw error;
  }
}

// Function to clear all products from the cart
async function clearCart(cartId) {
  try {
    await client.query(`
      DELETE FROM cart_products
      WHERE cart_id = $1;
    `, [cartId]);
  } catch (error) {
    throw new Error(`Error clearing cart: ${error.message}`);
  }
}

// Function to add a product to the cart
async function addProductToCart(cartId, productId, quantity) {
  try {
    // Check if the product already exists in the cart
    const existingProduct = await client.query(`
      SELECT * FROM cart_products
      WHERE cart_id = $1 AND product_id = $2;
    `, [cartId, productId]);

    if (existingProduct.rows.length > 0) {
      // If the product exists, update its quantity
      const newQuantity = existingProduct.rows[0].quantity + quantity;
      await client.query(`
        UPDATE cart_products
        SET quantity = $1
        WHERE cart_id = $2 AND product_id = $3;
      `, [newQuantity, cartId, productId]);
    } else {
      // If the product does not exist, add it to the cart
      await client.query(`
        INSERT INTO cart_products(cart_id, product_id, quantity)
        VALUES ($1, $2, $3);
      `, [cartId, productId, quantity]);
    }
  } catch (error) {
    throw new Error(`Error adding product to cart: ${error.message}`);
  }
}

// Function to remove a product from the cart
async function removeProductFromCart(cartProductId) {
  try {
    await client.query(`
      DELETE FROM cart_products
      WHERE product_id = $1;
    `, [cartProductId]);
  } catch (error) {
    throw new Error(`Error removing product from cart: ${error.message}`);
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

export {
  createCartProduct,
  getCartProductsByCartId,
  updateCartProduct,
  clearCart,
  addProductToCart,
  removeProductFromCart,
  deleteCartProduct
};