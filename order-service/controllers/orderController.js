import axios from 'axios';
import Order from '../models/Order.js';
import { publishOrderPlaced } from '../events/rabbitmq.js';

export const placeOrder = async (req, res) => {
    const { productId, quantity, email } = req.body;
    try {
        const inventoryRes = await axios.get(`${process.env.INVENTORY_SERVICE_URL}/${productId}`);
        if (!inventoryRes.data || inventoryRes.data.quantity < quantity) {
            return res.status(400).json({ msg: `Insufficient inventory` });
        }
       // const leftQuantity = inventoryRes.data.quantity - quantity;
        const order = new Order({ productId, quantity, name: inventoryRes.data.name, 
            price: inventoryRes.data.price, email: email, status: 'COMPLETED' });
        await order.save();
        // await axios.patch(`${process.env.INVENTORY_SERVICE_URL}/${productId}`, {
        //     quantity: leftQuantity
        // })
        //Publish order placed event
        await publishOrderPlaced(order);
        res.status(201).json({ msg: `Order placed, ${order}` });

    } catch (error) {
        res.status(500).json({ msg: `Order Placement failed ${error}` });
    }
}