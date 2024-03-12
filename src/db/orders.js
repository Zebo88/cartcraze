import client from './client.js';


async function getCurrentDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function createOrder(userId) {
  try {
    // Retrieve the current date
    const currentDate = await getCurrentDate();
        
    // Check if currentDate is valid
    if (!currentDate || !userId) {
      throw new Error('Failed to get the current date');
    }

    const query = `
      INSERT INTO orders (user_id, order_date)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const values = [userId, currentDate];
    const result = await client.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

async function createOrderItem(orderItemData) {
  try {
    const { orderId, productId, quantity } = orderItemData;
    const query = `
      INSERT INTO order_items (order_id, product_id, quantity)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [orderId, productId, quantity];
    const result = await client.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

async function getOrdersByUserId(userId) {
  try {
    const query = `
      SELECT DISTINCT ON (orders.order_id) orders.*, order_items.*
      FROM orders
      LEFT JOIN order_items ON orders.order_id = order_items.order_id
      WHERE orders.user_id = $1;
    `;
    const { rows } = await client.query(query, [userId]);
    
    // Check if there are no orders
    if (rows.length === 0) {
      return null;
    }
    
    return rows;
  } catch (error) {
    throw new Error(`Error fetching orders for user ID ${userId}: ${error.message}`);
  }
}

async function getSingleOrderByUserId(userId, orderId) {
  try {
    const orderQuery = `
      SELECT * FROM orders
      WHERE user_id = $1 AND order_id = $2;
    `;
    const orderResult = await client.query(orderQuery, [userId, orderId]);
    const order = orderResult.rows[0];

    const orderItemsQuery = `
      SELECT * FROM order_items
      WHERE order_id = $1;
    `;
    const orderItemsResult = await client.query(orderItemsQuery, [orderId]);
    const orderItems = orderItemsResult.rows;

    return { order, orderItems };
  } catch (error) {
    throw new Error(`Error fetching order ID ${orderId} for user ID ${userId}: ${error.message}`);
  }
}

async function getOrderItemsByOrderId(orderId) {
  try {
      const query = `
          SELECT * FROM order_items
          WHERE order_id = $1;
      `;
      const { rows } = await client.query(query, [orderId]);
      return rows;
  } catch (error) {
    throw new Error(`Error fetching order items for order ID ${orderId}: ${error.message}`);
  }
}

export {
  getCurrentDate,
  createOrder,
  createOrderItem,
  getOrdersByUserId,
  getSingleOrderByUserId,
  getOrderItemsByOrderId
};