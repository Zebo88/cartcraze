const client = require('./client');


async function createProduct({ title, price, category, description, image, rate, count }) {
    try {
        const { rows } = await client.query(`
            INSERT INTO products(title, price, category, description, image, rate, count)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `, [title, price, category, description, image, rate, count]);

        if (rows.length > 0) {
            return rows[0]; // Return the newly created product
        } else {
            throw new Error("Failed to create product");
        }
    } catch (error) {
        throw error;
    }
}

async function getProductById(productId) {
  try {
      const { rows } = await client.query(`
          SELECT * FROM products WHERE product_id = $1;
      `, [productId]);

      if (rows.length === 0) {
          return null; // Return null if no product with the given ID is found
      }

      return rows[0]; // Return the first product found with the given ID
  } catch (error) {
      throw error;
  }
}

async function getAllProducts() {
  try {
      const { rows } = await client.query(`
          SELECT * FROM products;
      `);

      return rows; // Return all products from the database
  } catch (error) {
      throw error;
  }
}

async function searchProducts(searchTerm) {
  try {
    const query = `
      SELECT * FROM products
      WHERE title LIKE '%' || $1 || '%'
        OR category LIKE '%' || $1 || '%'
        OR description LIKE '%' || $1 || '%';
    `;
    const { rows } = await client.query(query, [searchTerm]);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function updateProduct(productId, fieldsToUpdate) {
    try {
        // Construct the SET clause dynamically based on the fields to update
        const setClause = Object.keys(fieldsToUpdate)
            .map((key, index) => `${key} = $${index + 1}`)
            .join(', ');

        const values = Object.values(fieldsToUpdate);
        values.push(productId); // Add the productId to the end for WHERE clause

        const { rows } = await client.query(`
            UPDATE products
            SET ${setClause}
            WHERE product_id = $${values.length} 
            RETURNING *;
        `, values);

        if (rows.length > 0) {
            return rows[0]; // Return the updated product
        } else {
            throw new Error("Product not found");
        }
    } catch (error) {
        throw error;
    }
}

async function deleteProduct(productId) {
    try {
        const { rowCount } = await client.query(`
            DELETE FROM products
            WHERE product_id = $1;
        `, [productId]);

        if (rowCount === 0) {
            throw new Error("Product not found");
        }
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createProduct,
    getProductById,
    getAllProducts,
    searchProducts,
    updateProduct,
    deleteProduct
};