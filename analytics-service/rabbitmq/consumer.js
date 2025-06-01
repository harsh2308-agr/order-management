import Analytics from "../models/analytics.js";
import redisClient from '../config/redis.js';

export const consumeOrderPlaced = async (channel) => {
    if(!channel) return console.log('Channel not initialized');
    const QUEUE = 'order_analytics';
    await channel.assertQueue(QUEUE, { durable: true });
    channel.consume(QUEUE, async (msg) => {
        console.log('MSG ', msg);
        if (msg != null) {
            try {
                const data = JSON.parse(msg.content.toString());
                console.log('Received order: ', data);
                const { productId, name, quantity, price } = data;
                const revenue = quantity * price;
                let analytics = await Analytics.findOne();
                if (!analytics) {
                    analytics = new Analytics({
                        totalOrders: 1,
                        totalRevenue: revenue,
                        salesByProduct: [{
                            productId,
                            name,
                            quantitySold: quantity,
                            revenue
                        }]
                    })
                } else {
                    analytics.totalOrders += 1;
                    analytics.totalRevenue += revenue;
                    const productIndex = analytics.salesByProduct.findIndex((p) => p.productId === productId);
                    if (productIndex > -1) {
                        analytics.salesByProduct[productIndex].quantitySold += quantity;
                        analytics.salesByProduct[productIndex].revenue += revenue;
                    } else {
                        analytics.salesByProduct.push({
                            productId,
                            name,
                            quantitySold: quantity,
                            revenue
                        })
                    }
                }
                await analytics.save();

                await redisClient.del('analytics:summary');
                console.log(`analytics updated successfully ${analytics}`);
                channel.ack(msg);
            } catch (error) {
                console.log(`Error processing order_placed ${error}`);
            }
        }
    })
}