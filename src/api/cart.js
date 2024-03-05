const express = require('express');
const router = express.Router();
const { createCart, getCartByUserId, updateCart, deleteCart } = require('../db/cart');
const { requireUser } = require('./util');


// POST /api/cart - Create a new cart
router.post('/', requireUser, async (req, res, next) => {
    try {
        const { userId, date } = req.body;
        const newCart = await createCart({ userId, date });
        res.status(201).json(newCart);
    } catch (error) {
        next(error);
    }
});

// GET /api/cart/:userId - Get cart by user ID
router.get('/:userId', requireUser, async (req, res, next) => {
    try {
        const { userId } = req.params;
        const cart = await getCartByUserId(userId);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.json(cart);
    } catch (error) {
        next(error);
    }
});

// PUT /api/cart/:cartId - Update cart by cart ID
router.put('/:cartId', requireUser, async (req, res, next) => {
    try {
        const { cartId } = req.params;
        const updatedCart = await updateCart({ cartId, ...req.body });
        res.json(updatedCart);
    } catch (error) {
        next(error);
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

module.exports = router;