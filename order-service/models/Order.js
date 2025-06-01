import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    price: {
        type: Number
    },
    quantity: {
        type: Number,
        required: true
    },
    email: {
        type: String
    },
    status: {
        type: String,
        enum: ['PENDING', 'COMPLETED', 'FAILED'],
        default: 'PENDING'
    }
}, { timestamps: true});

export default mongoose.model("Order", orderSchema);
