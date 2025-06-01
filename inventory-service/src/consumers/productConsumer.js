import Inventory from "../models/Inventory.js";

const QUEUE_NAME = 'product_created';
const DELETE_NAME = 'product_deleted';
const ORDER_PLACED = 'order_placed';

export const consumeProductMessages = async (channel) => {
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    channel.consume(QUEUE_NAME, async (msg) => {
        if (msg) {
            try {
                const data = JSON.parse(msg.content.toString());
                const existing = await Inventory.findOne({ productId: data._id });
                if (!existing) {
                    const newInventory = new Inventory({ _id: data._id, productId: data._id, quantity: 100, name: data.name, price: data.price });
                    await newInventory.save();
                    console.log("Inventory initialised", data._id);
                }
                channel.ack(msg);
            } catch (error) {
                console.log(error);
            }
        }
    })
}

export const consumeorderPlaced = async (channel) => {
    await channel.assertQueue(ORDER_PLACED, { durable: true });
    channel.consume(ORDER_PLACED, async (msg) => {
        if (msg != null) {
            try {
                const data = JSON.parse(msg.content.toString());
                console.log('Order received in the inventory', data);
                const inventory = await Inventory.findOne({ productId: data.productId });
                if (inventory) {
                    inventory.quantity -= data.quantity;
                    await inventory.save();
                    console.log(`Updated inventory for product ${data.productId}`);
                } else {
                    console.log(`Inventory not found`);
                }
            } catch (error) {
                console.log(error);
            }
        }
    })
}

export const deleteProductMessages = async (channel) => {
    await channel.assertQueue(DELETE_NAME, { durable: true });
    channel.consume(DELETE_NAME, async (msg) => {
        if (msg) {
            try {
                const data = JSON.parse(msg.content.toString());
                const result = await Inventory.findByIdAndDelete(data.id);
                if (!result) return res.status(404).json({ message: 'Product not found' });
                console.log('product deleted');
                channel.ack(msg);
            } catch (error) {
                console.log(error);
            }
        }
    })
}

export const getInventory = async (req, res) => {
    try {
        const { productId } = req.params;
        const inventory = await Inventory.findOne({ productId });
        if (!inventory) {
            return res.status(404).json({ msg: `Inventory not found ${error}` });
        }
        res.status(200).json(inventory);
    } catch (error) {
        res.status(500).json({ msg: `Error fetching inventory ${error}` });
    }
}

export const updateInventory = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        const inventory = await Inventory.findOneAndUpdate({ productId }, {
            quantity: quantity
        }, { new: true });

        if (!inventory) {
            res.status(404).json({ msg: `Inventory not found` });
        }
        res.status(200).json(inventory);
    } catch (error) {
        res.status(500).json({ msg: `Error updating the inventiory ${error}` })
    }
}