import amqp from 'amqplib';
import dotenv from 'dotenv';
dotenv.config();

let channel;

const connectRabbitMQ = async ()=>{
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URI);
        channel = await connection.createChannel();
        console.log("RabbitMQ connected");
        return channel;
    } catch (error) {
        console.error("RabbitMQ connection error", error);
        process.exit(1);
    }
}

export { connectRabbitMQ };

