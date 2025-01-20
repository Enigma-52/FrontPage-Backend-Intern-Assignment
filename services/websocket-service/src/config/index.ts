import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: parseInt(process.env.PORT || '8000', 10),
    rabbitmq: {
        url: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
        exchange: 'hn_stories',
        exchangeType: 'fanout',
        queueName: 'websocket_queue'
    },
    ws: {
        pingInterval: 30000, // 30 seconds
        pingTimeout: 5000   // 5 seconds
    }
};