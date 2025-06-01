import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db.js';
import orderRoutes from './routes/orderRoutes.js';
import { connectRabbitMQ } from './events/rabbitmq.js';

dotenv.config();
const app = express();
app.use(express.json());
connectDB();
connectRabbitMQ();

app.use((req, res, next)=>{
    next();
})
app.use('/orders', orderRoutes);

const PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log(`ORDER api is running on PORT ${PORT}`);
})