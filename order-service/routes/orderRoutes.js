import express from 'express';
import { placeOrder } from '../controllers/orderController.js';
import { verifyJWT } from '../middleware/authMiddleware.js';
import { verifyRole } from '../middleware/verifyRoleMiddleware.js';

const router = express.Router();

router.post('/', verifyJWT, verifyRole('user'), placeOrder);

export default router;