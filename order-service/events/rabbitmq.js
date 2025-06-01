import amqp from 'amqplib'
let channel;

export const publishOrderPlaced = async (order) => {
    try {
        if (!channel) throw new Error('RabbitMQ channel is not initialized');
        const QUEUE = 'order_placed';
        const ORDER_QUEUE = 'order_analytics';
        await channel.assertQueue(QUEUE, { durable: true });
        channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(order)), { persistent: true});

        await channel.assertQueue(ORDER_QUEUE, { durable: true });
        channel.sendToQueue(ORDER_QUEUE, Buffer.from(JSON.stringify(order)), { persistent: true});
        console.log('Published order placed event', order);
    } catch (error) {
        console.log('error publishing order placed', error);
    }
}

export const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URI);
        channel = await connection.createChannel();
        console.log('✅ Connected to RabbitMQ');
    } catch (error) {
        console.error('❌ RabbitMQ connection error:', error);
        process.exit(1);
    }
};

export const getChannel=()=>{
    if(!channel){
        throw new Error('Channel not initialized');
    }
    return channel;
}