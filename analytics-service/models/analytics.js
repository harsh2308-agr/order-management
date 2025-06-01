import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
    totalOrders: {
        type: Number,
        default: 0
    },
    totalRevenue: {
        type: Number,
        default: 0
    },
    salesByProduct: [
        {
            productId: String,
            name: String,
            quantitySold: Number,
            revenue: Number
        }
    ]
}, { timestamps: true });

export default mongoose.model('Analytics', analyticsSchema);