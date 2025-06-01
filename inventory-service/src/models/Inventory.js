import mongoose from 'mongoose';

const inventorySchema =
    new mongoose.Schema({
        productId: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            default: 100
        },
        quantity: {
            type: Number,
            required: true,
            default: 100
        }
    }, { timestamps: true })
export default mongoose.model("Inventory", inventorySchema);