const client = require('./client');


async function createProduct({ name, description, price, category }) {
    try {
        const { rows } = await client.query(`
            INSERT INTO products(name, description, price, category)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `, [name, description, price, category]);

        if (rows.length > 0) {
            return rows[0]; // Return the newly created product
        } else {
            throw new Error("Failed to create product");
        }
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
            WHERE id = $${values.length} 
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
            WHERE id = $1;
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
    updateProduct,
    deleteProduct
};