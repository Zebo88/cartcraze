const express = require('express');
const router = express.Router();
const { requireUser } = require('./util');
const { createProduct, getProductById, getAllProducts, searchProducts, updateProduct, deleteProduct } = require('../db/product');


// POST /api/products - Create a new product
router.post('/', requireUser, async (req, res, next) => {
  try {
    const { name, description, price, category } = req.body;
    const newProduct = await createProduct({ name, description, price, category });
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
});

// GET /api/products/:productId - Get product by ID
router.get('/:productId', async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await getProductById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
});

// GET /api/products - Get all products
router.get('/', async (req, res, next) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
});

// POST /api/products/search - Search products
router.post('/search', async (req, res, next) => {
  try {
    const { searchTerm } = req.body;
    const searchResults = await searchProducts(searchTerm);
    res.json(searchResults);
  } catch (error) {
    next(error);
  }
});

// PUT /api/products/:productId - Update product by ID
router.put('/:productId', requireUser, async (req, res, next) => {
  try {
    const { productId } = req.params;
    const updatedProduct = await updateProduct(productId, req.body);
    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/products/:productId - Delete product by ID
router.delete('/:productId', requireUser, async (req, res, next) => {
  try {
    const { productId } = req.params;
    await deleteProduct(productId);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;