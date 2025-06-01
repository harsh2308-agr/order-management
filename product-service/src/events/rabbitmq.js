import amqp from 'amqplib';

let channel;

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

export const publishToQueue = async (queueName, data) => {
  try {
    if (!channel) throw new Error('RabbitMQ channel is not initialized');
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
  } catch (error) {
    console.error('❌ Failed to publish to queue:', error.message);
  }
};