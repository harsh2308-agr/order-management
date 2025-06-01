import amqp from 'amqplib';
let channel;

export const connectRabbitMQ = async () => {
    const connection = await amqp.connect(process.env.RABBITMQ_URI);
    channel = await connection.createChannel();
    console.log('Notification service connected to rabbitMQ');
    return channel;
}