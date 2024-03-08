import express from 'express';
import { createCart, getCartByUserId, deleteCart } from '../db/cart.js';
import { updateCartProduct } from '../db/cart_products.js';
import { addProductToCart, clearCart, removeProductFromCart } from '../db/cart_products.js';
import { createOrder, getOrdersByUserId, getOrderItemsByOrderId, getSingleOrderByUserId, createOrderItem } from '../db/orders.js';
import { requireUser } from './util.js';

const router = express.Router();


// POST /api/orders/:userId/create - Create a new order
router.post('/:userId/create', requireUser, async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);

    // Check if userId and orderDate are provided
    if (!userId) {
      return res.status(400).json({ error: 'Missing required user id' });
    }

    // Call the createOrder function to create the order
    const newOrder = await createOrder( userId );

    // Send a success response with the newly created order data
    res.status(201).json({ order: newOrder, message: 'Order created successfully' });
  } catch (error) {
    // Send an error response for any errors that occur during order creation
    res.status(500).json({ error: error.message });
  }
});

// GET /api/orders/user/:userId - Get orders by user ID
router.get('/user/:userId', requireUser, async (req, res) => {
  try {
    const { userId } = req.params;

    // Call the getOrdersByUserId function to retrieve orders by user ID
    const orders = await getOrdersByUserId(userId);

    // Create an array to store orders with their associated items
    const ordersWithItems = [];

    // Loop through the orders
    for (const order of orders) {
      // Retrieve order items for the current order
      const orderItems = await getOrderItemsByOrderId(order.order_id);

      // Create an object to represent the current order with its items
      const orderWithItems = {
        order_id: order.order_id,
        user_id: order.user_id,
        order_date: order.order_date,
        order_items: orderItems.map(item => ({
          order_item_id: item.order_item_id,
          product_id: item.product_id,
          quantity: item.quantity
        }))
      };

      // Add the order with its items to the array
      ordersWithItems.push(orderWithItems);
    }

    // Send a success response with the orders and their associated items
    res.status(200).json({ orders: ordersWithItems });
  } catch (error) {
    // Send an error response if any error occurs during the retrieval process
    res.status(500).json({ error: error.message });
  }
});

// GET /api/orders/:orderId/users/:userId - Get a single order with ID for a user with ID
router.get('/:orderId/users/:userId', async (req, res) => {
  const { userId, orderId } = req.params;

  try {
    // Call the function to get the single order by user ID and order ID
    const { order, orderItems } = await getSingleOrderByUserId(userId, orderId);

    // Construct the response object
    const orderWithItems = {
      order_id: order.order_id,
      user_id: order.user_id,
      order_date: order.order_date,
      order_items: orderItems.map(item => ({
        order_item_id: item.order_item_id,
        product_id: item.product_id,
        quantity: item.quantity
      }))
    };

    // Send the response with the order data including its items
    res.status(200).json(orderWithItems);
  } catch (error) {
    // Send an error response if there's any issue
    res.status(500).json({ error: error.message });
  }
});

// POST /api/order/:orderId/add - Add item to an order
router.post('/:orderId/add', requireUser, async (req, res) => {
  try {
    // Extract orderId from the route parameters
    const { orderId } = req.params;

    // Extract data from the request body
    const { productId, quantity } = req.body;

    // Check if all required fields are provided
    if (!productId || !quantity) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Call the createOrderItem function to add the item to the order
    const newItem = await createOrderItem({ orderId, productId, quantity });

    // Send a success response with the newly created item
    res.status(201).json({ item: newItem, message: 'Item added to order successfully' });
  } catch (error) {
    // Send an error response if there's an error during item addition
    res.status(500).json({ error: error.message });
  }
});


export default router;