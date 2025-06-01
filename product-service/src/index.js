import app from './app.js';
import connectDB from './config/db.js';
import {connectRabbitMQ} from './events/rabbitmq.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT  = process.env.PORT || 8000;
async function startServer() {
    try {
        await connectDB();
        await connectRabbitMQ();
        app.listen(PORT, ()=>{
            console.log(`Product catlog service is running on PORT ${PORT}`);
        });
    } catch (error) {
        console.log(`Error starting the server ${error}`);
        process.exit(1);
    }
}

startServer();