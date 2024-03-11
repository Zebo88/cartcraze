import express from 'express';
import { requireUser } from './util.js';
import { createProduct, getProductById, getAllProducts, getSortedProducts, searchProducts, getProductCategories, getProductsByCategory, updateProduct, deleteProduct } from '../db/products.js';

const router = express.Router();


// GET /api/products - Get all products
router.get('/', async (req, res, next) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
});

//GET /api/products/categories - Get a list of categories from the products table
router.get('/categories', async (req, res) => {
  try {
    // Call the function to fetch product categories
    const categories = await getProductCategories();

    // Send the categories as a response
    res.json(categories);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/products/category/:category - Get all products of a specific category
router.get('/category/:category', async (req, res, next) => {
  try {
    const { category } = req.params;
    // Add your logic here to fetch products of the specified category
    const products = await getProductsByCategory(category);
    res.json(products);
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

// GET /api/products/sort/:direction/min/:minPrice/max/:maxPrice
// Get products in a sorted order (direction ascending or descending) and a price range (min - max)
router.get('/sort/:direction/min/:minPrice/max/:maxPrice', async (req, res) => {
  try {
    const { direction, minPrice, maxPrice } = req.params;
    const products = await getSortedProducts(direction, minPrice, maxPrice);
    // Send the products as a response
    res.json(products);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
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

export default router;
