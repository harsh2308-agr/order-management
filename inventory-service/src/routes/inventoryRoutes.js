import express from 'express';
import { getInventory, updateInventory } from '../consumers/productConsumer.js';

const router = express.Router();

router.get("/:productId", getInventory);

router.patch("/:productId", updateInventory);

export default router;