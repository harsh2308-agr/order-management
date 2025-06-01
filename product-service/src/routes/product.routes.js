import express from 'express';
import { createProduct, deleteProduct } from '../controllers/product.controller.js';

const router = express.Router();

//route for creating the product
router.post('/', createProduct);

//route for deleting the product
router.post('/delete/:id', deleteProduct);

export default router;