import express from 'express';
import { connectRabbitMQ } from "../src/config/rabbitmq.js";
import connectDB from "./config/db.js";
import { consumeProductMessages, deleteProductMessages, consumeorderPlaced } from "./consumers/productConsumer.js";
import inventoryRouter from './routes/inventoryRoutes.js';
const start = async() =>{
    connectDB();
    const channel = await connectRabbitMQ();
    await consumeProductMessages(channel);
    await deleteProductMessages(channel);
    await consumeorderPlaced(channel);
};

start();

const app = express();
app.use(express.json());
app.use('/inventory', inventoryRouter);

app.listen(process.env.PORT, ()=>{
    console.log(`Inventory is running on PORT ${process.env.PORT}`);
})