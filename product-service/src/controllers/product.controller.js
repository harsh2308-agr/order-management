import Product from '../models/product.js';
import { publishToQueue } from '../events/rabbitmq.js';

// Create Product
export const createProduct = async (req, res) => {
  try {
    const { name, category, price, quantity } = req.body;
    const product = new Product({ name, category, price, quantity });
    await product.save();

    // Publish to RabbitMQ
    await publishToQueue('product_created', product);

    res.status(201).json({ message: 'Product created', product });
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, quantity } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, quantity },
      { new: true }
    );

    if (!product) return res.status(404).json({ message: 'Product not found' });

    await publishToQueue('product_updated', product);

    res.status(200).json({ message: 'Product updated', product });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    console.log("ID: ", req.params.id);
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await publishToQueue('product_deleted', {id: req.params.id}, { persistent: true });

    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};