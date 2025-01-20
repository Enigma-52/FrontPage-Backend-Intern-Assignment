import amqp, { Channel, Connection } from 'amqplib';
import { Story } from '../models/story';
import { Logger } from '../utils/logger';

export class RabbitMQService {
    private connection: Connection | null = null;
    private channel: Channel | null = null;
    private readonly exchangeName = 'hn_stories';

    constructor() {}

    public async initialize(): Promise<void> {
        try {
            this.connection = await amqp.connect(process.env.RABBITMQ_URL!);
            this.channel = await this.connection.createChannel();

            await this.channel.assertExchange(this.exchangeName, 'fanout', {
                durable: false
            });

            Logger.info('RabbitMQ initialized');
        } catch (error) {
            Logger.error('Failed to initialize RabbitMQ:');
            throw error;
        }
    }

    public async publishStory(story: Story): Promise<void> {
        if (!this.channel) {
            throw new Error('RabbitMQ channel not initialized');
        }

        try {
            const message = Buffer.from(JSON.stringify(story));
            await this.channel.publish(
                this.exchangeName,
                '', 
                message
            );
            Logger.info(`Published story to RabbitMQ: ${story.id}`);
        } catch (error) {
            Logger.error(`Failed to publish story ${story.id}:`);
            throw error;
        }
    }

    public async close(): Promise<void> {
        try {
            await this.channel?.close();
            await this.connection?.close();
        } catch (error) {
            Logger.error('Error closing RabbitMQ connection:');
        }
    }
}