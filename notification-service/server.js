import dotenv from 'dotenv';
import { connectRabbitMQ } from './rabbit.js';
import { consumeOrderNotification } from './listener.js';

dotenv.config();
const start = async()=>{
    const channel = await connectRabbitMQ();
    await consumeOrderNotification(channel);
}

start();