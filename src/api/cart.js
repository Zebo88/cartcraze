import express from 'express';
import { createCart, getCartByUserId, getCartItemsByCartId, deleteCart } from '../db/cart.js';
import { updateCartProduct } from '../db/cart_products.js';
import { addProductToCart, clearCart, removeProductFromCart } from '../db/cart_products.js';
import { getProductById } from '../db/products.js';
import { requireUser } from './util.js';

const router = express.Router();


// POST /api/cart - Create a new cart
router.post('/', requireUser, async (req, res, next) => {
    try {
        const { userId } = req.body;
        const newCart = await createCart( userId );
        res.status(201).json(newCart);
    } catch (error) {
        next(error);
    }
});

// GET /api/cart/user/:userId - Get cart by user ID
router.get('/user/:userId', requireUser, async (req, res, next) => {
  try {
      const { userId } = req.params;
      const cart = await getCartByUserId(userId);
      
      if (!cart) {
          return res.status(404).json({ message: 'Cart not found' });
      }

      // Retrieve cart items for the current cart
      const cartItems = await getCartItemsByCartId(cart.cart_id);

      // Initialize an array to store cart items with product details
      const cartItemsWithProducts = [];

      // Loop through cart items
      for (const item of cartItems) {
          // Retrieve product details for the current item
          const product = await getProductById(item.product_id);

          // Add detailed product information to the cart item
          const cartItemWithProduct = {
              product_id: item.product_id,
              title: product.title,
              price: product.price,
              category: product.category,
              description: product.description,
              image: product.image,
              rate: product.rate,
              count: product.count,
              quantity: item.quantity,
          };

          // Add the cart item with product details to the array
          cartItemsWithProducts.push(cartItemWithProduct);
      }

      // Construct the response object
      const cartWithItems = {
          cart_id: cart.cart_id,
          user_id: cart.user_id,
          products: cartItemsWithProducts
      };

      res.json(cartWithItems);
  } catch (error) {
      next(error);
  }
});

// POST /api/cart/:userId - Add a product and quantity to the cart with ID
router.post('/:userId', requireUser, async (req, res) => {
  const { productId, quantity } = req.body;
  const  userId  = req.params.userId; // Assuming user_id is available in req.user

  try {
    // Check if productId and quantity are provided
    if (!productId || !quantity) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Retrieve the user's cart
    let cart = await getCartByUserId(userId);
    if (!cart) {
      // If the cart doesn't exist, create a new one
      cart = await createCart(userId);
      if (!cart) {
        return res.status(500).json({ error: 'Failed to create cart for the user' });
      }
    }

    const { cart_id } = cart;

    // Call the function to add the product to the cart
    await addProductToCart(cart_id, productId, quantity);

    res.status(200).json({ message: 'Product added to cart successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/cart/:cartId - Update the quantity of a product in the cart with ID
router.put('/:cartId', requireUser, async (req, res, next) => {
  try {
      const { cartId } = req.params;
      const { productId, quantity } = req.body;

      // Assuming you have a function to update the cart in the database
      const updatedCart = await updateCartProduct({ cartId, productId, quantity });

      res.json(updatedCart);
  } catch (error) {
      next(error);
  }
});

// DELETE /api/cart/:cartId/remove/:cartProductId - Remove an item from the cart with ID
router.delete('/:cartId/remove/:cartProductId', requireUser, async (req, res) => {
  const { cartProductId } = req.params;
  try {
    await removeProductFromCart(cartProductId);
    res.status(200).json({ message: 'Product removed from cart successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/cart/:cartId/clear - Remove items from the cart with ID
router.delete('/:cartId/clear', requireUser, async (req, res) => {
  const { cartId } = req.params;
  try {
    await clearCart(cartId);
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/cart/:cartId - Delete cart by cart ID
router.delete('/:cartId', requireUser, async (req, res, next) => {
  try {
      const { cartId } = req.params;
      const deletedCart = await deleteCart(cartId);
      res.json(deletedCart);
  } catch (error) {
      next(error);
  }
});

export default router;