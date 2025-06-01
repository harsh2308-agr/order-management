import { sendOrderEmail } from "./mailer.js";

const ORDER_PLACED = 'order_placed';

export const consumeOrderNotification = async (channel) => {
    await channel.assertQueue(ORDER_PLACED, { durable: true });
    channel.consume(ORDER_PLACED, async (msg) => {
        if (msg != null) {
            const order = JSON.parse(msg.content.toString());
            const emailContent = `<h2>Order Confirmation</h2>
            <p> Your order for <b>${order.productid}</b> with quantity <b>${order.quantity}</b> 
            has been placed</p>`;
            await sendOrderEmail(order.email, 'Your Order Confirmed', emailContent);
            console.log('Notification sent');
            channel.ack(msg);
        }
    })
}