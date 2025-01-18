import amqp, { Channel, Connection } from 'amqplib';
import { QueueConfig } from '../models/types/queue.types';
import { rabbitmqConfig } from '../config/rabbitmq';
import { Logger } from '../utils/logger';
import { QueueError } from '../utils/errors';

export class QueueService {
    private channel: Channel | null = null;
    private connection: Connection | null = null;
    private readonly config: QueueConfig;

    constructor(config: QueueConfig) {
        this.config = config;
    }

    public async connect(): Promise<void> {
        let attempts = 0;
        while (attempts < rabbitmqConfig.connection.retryLimit) {
            try {
                this.connection = await amqp.connect(this.config.url);
                this.channel = await this.connection.createChannel();
                
                await this.channel.assertExchange(
                    this.config.exchangeName,
                    this.config.exchangeType,
                    rabbitmqConfig.exchange.options
                );

                Logger.info('Successfully connected to RabbitMQ');
                this.setupErrorHandlers();
                return;
            } catch (error) {
                attempts++;
                Logger.error(`Failed to connect to RabbitMQ (attempt ${attempts}):`, error as Error);
                await new Promise(resolve => setTimeout(resolve, rabbitmqConfig.connection.retryInterval));
            }
        }
        throw new QueueError('Failed to connect to RabbitMQ after multiple attempts');
    }

    private setupErrorHandlers(): void {
        if (!this.connection) return;

        this.connection.on('error', (error: Error) => {
            Logger.error('RabbitMQ connection error:', error);
        });

        this.connection.on('close', () => {
            Logger.error('RabbitMQ connection closed, attempting to reconnect...');
            setTimeout(() => this.connect(), rabbitmqConfig.connection.retryInterval);
        });
    }

    public async publish(data: unknown): Promise<boolean> {
        if (!this.channel) {
            throw new QueueError('Channel not initialized');
        }

        try {
            const message = Buffer.from(JSON.stringify(data));
            return this.channel.publish(
                this.config.exchangeName,
                '',
                message
            );
        } catch (error) {
            throw new QueueError('Failed to publish message to queue');
        }
    }

    public async close(): Promise<void> {
        try {
            await this.channel?.close();
            await this.connection?.close();
        } catch (error) {
            Logger.error('Error closing RabbitMQ connection:', error as Error);
        }
    }
}
