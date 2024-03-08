import express from 'express';
import jwt from 'jsonwebtoken';
import { getUserById } from '../db/user.js';
import client from '../db/client.js';

const router = express.Router();
const JWT_SECRET = 'yankees3DJtheCap';

router.get('/health', async (req, res, next) => {
  try {
    const uptime = process.uptime();
    const { rows: [dbConnection] } = await client.query('SELECT NOW();');
    const currentTime = new Date();
    const lastRestart = new Intl.DateTimeFormat('en', { timeStyle: 'long', dateStyle: 'long', timeZone: "America/Los_Angeles" }).format(currentTime - (uptime * 1000));
    res.send({ message: 'healthy', uptime, dbConnection, currentTime, lastRestart });
  } catch (err) {
    next(err);
  }
});

router.use(async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');

  if (!auth) {
    next(); // Proceed to the next middleware if no token is provided
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const parsedToken = jwt.verify(token, JWT_SECRET);
      if (parsedToken && parsedToken.id) {
        // Fetch the user only if the token contains a valid user ID
        req.user = await getUserById(parsedToken.id);
      }
      next(); // Proceed to the next middleware regardless of whether user is fetched
    } catch (error) {
      next(new Error('Invalid token')); // Pass the error to the error handling middleware
    }
  } else {
    next(new Error('Invalid token')); // Pass the error to the error handling middleware
  }
});

router.use((req, res, next) => {
  if (req.user) {
    console.log("User is set:", req.user);
  }
  next();
});

// ROUTER: /user
import userRouter from './user.js';
router.use('/user', userRouter);

// ROUTER: /products
import productsRouter from './products.js';
router.use('/products', productsRouter);

// ROUTER: /cart
import cartRouter from './cart.js';
router.use('/cart', cartRouter);

// ROUTER: /cart
import ordersRouter from './orders.js';
router.use('/orders', ordersRouter);


export default router;
