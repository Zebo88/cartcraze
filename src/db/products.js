import client from './client.js';


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

    if (rows.length > 0) {
      return rows; // Return the results
    } else {
        throw new Error("No Results");
    }

  } catch (error) {
    throw error;
  }
}

// Function to fetch all product categories from the database
async function getProductCategories() {
  try {
    // SQL query
    const sql = 'SELECT DISTINCT category FROM products';

    // Execute the query and await the result
    const result = await client.query(sql);

    // Extract the categories from the query result
    const categories = result.rows.map(row => row.category);

    return categories;
  } catch (error) {
    // Handle any errors that occur during the database operation
    throw new Error(`Error fetching product categories: ${error.message}`);
  }
}

// Function to fetch products by category from the database
async function getProductsByCategory(category) {
  try {
    const query = `
      SELECT * FROM products
      WHERE category = $1
    `;
    const { rows } = await client.query(query, [category]);

    return rows;
  } catch (error) {
    throw new Error(`Error fetching products of category ${category}: ${error.message}`);
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

export { 
  createProduct,
  getProductById,
  getAllProducts,
  searchProducts,
  getProductCategories,
  getProductsByCategory,
  updateProduct,
  deleteProduct };