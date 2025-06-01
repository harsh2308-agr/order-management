import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import { consumeOrderPlaced } from './rabbitmq/consumer.js';
import amqp from 'amqplib';

dotenv.config();
const app = express();
app.use(express.json());

connectDB();
app.use('/api/analytics', analyticsRoutes);
const startRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URI);
        const channel = await connection.createChannel();
        await consumeOrderPlaced(channel);
        console.log('Rabbitmq channel connected');
    } catch (error) {
        console.log(`Rabbitmq error ${error}`);
    }
}

app.listen(process.env.PORT || 5005, ()=>{
    startRabbitMQ();
    console.log(`Analytics is runnig on PORT ${process.env.PORT}`);
})