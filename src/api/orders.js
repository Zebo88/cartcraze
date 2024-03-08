import express from 'express';
import { getCartByUserId } from '../db/cart.js';
import { clearCart, getCartProductsByCartId } from '../db/cart_products.js';
import { createOrder, getOrdersByUserId, getOrderItemsByOrderId, getSingleOrderByUserId, createOrderItem } from '../db/orders.js';
import { getProductById } from '../db/products.js';
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

    // Check if orders is empty
    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: 'No orders found for the user' });
    }

    // Initialize an array to store orders with their associated items
    const ordersWithItems = [];

    // Loop through the orders
    for (const order of orders) {
      // Retrieve order items for the current order
      const orderItems = await getOrderItemsByOrderId(order.order_id);

      // Initialize an array to store the order items for the current order
      const orderItemsArray = [];

      // Loop through the order items
      for (const item of orderItems) {
        // Retrieve product details for the current item
        const product = await getProductById(item.product_id);

        // Add detailed product information to the order item
        const orderItemWithProduct = {
          product_id: item.product_id,
          title: product.title,
          price: product.price,
          category: product.category,
          description: product.description,
          image: product.image,
          rate: product.rate,
          count: product.count,
          quantity: item.quantity
        };

        // Add the order item with product details to the array
        orderItemsArray.push(orderItemWithProduct);
      }

      // Create an object to represent the current order with its items
      const orderWithItems = {
        order_id: order.order_id,
        user_id: order.user_id,
        order_date: order.order_date,
        products: orderItemsArray
      };

      // Add the order with its items to the array
      ordersWithItems.push(orderWithItems);
    }

    // Send a success response with the orders and their associated items
    res.status(200).json(ordersWithItems);
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

    // Initialize an array to store order items with their associated products
    const orderItemsArray = [];

    // Loop through the order items
    for (const item of orderItems) {
      // Retrieve product details for the current item
      const product = await getProductById(item.product_id);

      // Add detailed product information to the order item
      const orderItemWithProduct = {
        product_id: item.product_id,
        title: product.title,
        price: product.price,
        category: product.category,
        description: product.description,
        image: product.image,
        rate: product.rate,
        count: product.count,
        quantity: item.quantity
      };

      // Add the order item with product details to the array
      orderItemsArray.push(orderItemWithProduct);
    }

    // Construct the response object
    const orderWithItems = {
      order_id: order.order_id,
      user_id: order.user_id,
      order_date: order.order_date,
      products: orderItemsArray
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

// POST /api/orders/user/:userId/purchase - Create order using the items from the cart.
router.post('/user/:userId/purchase', requireUser, async (req, res) => {
  try {
    const userId = req.params.userId; // Corrected accessing userId from params
    // Get user's cart
    const cart = await getCartByUserId(userId);
    if (!cart) {
      return res.status(400).json({ error: 'Cart not found' });
    }
    // Get user's cart items
    const cartItems = await getCartProductsByCartId(cart.cart_id);
    if (!cartItems.length) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    // Create an order for the user
    const order = await createOrder(userId);
    // Add cart items as order items
    for (const item of cartItems) {
      await createOrderItem({
        orderId: order.order_id, 
        productId: item.product_id,
        quantity: item.quantity
      });
    }
    // Clear the user's cart
    await clearCart(cart.cart_id);
    res.status(200).json({ message: 'Purchase successful' });
  } catch (error) {
    // Handle errors
    console.error('Purchase error:', error);
    res.status(500).json({ error: 'Failed to process purchase' });
  }
});


export default router;