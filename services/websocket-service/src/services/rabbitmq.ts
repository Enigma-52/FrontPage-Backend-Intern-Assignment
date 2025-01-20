import amqp, { Channel, Connection, ConsumeMessage } from 'amqplib';
import { config } from '../config';
import { Logger } from '../utils/logger';
import { Story } from '../types/story.types';
import { WebSocketService } from './websocket';
import { error } from 'console';

export class RabbitMQService {
    private connection: Connection | null = null;
    private channel: Channel | null = null;
    private readonly wsService: WebSocketService;

    constructor(wsService: WebSocketService) {
        this.wsService = wsService;
    }

    public async connect(): Promise<void> {
        try {
            this.connection = await amqp.connect(config.rabbitmq.url);
            this.channel = await this.connection.createChannel();

            await this.channel.assertExchange(
                config.rabbitmq.exchange,
                config.rabbitmq.exchangeType,
                { durable: false }
            );

            const { queue } = await this.channel.assertQueue(
                config.rabbitmq.queueName,
                { exclusive: true }
            );

            await this.channel.bindQueue(
                queue,
                config.rabbitmq.exchange,
                ''
            );

            await this.channel.consume(queue, (msg) => {
                if (msg) {
                    this.handleMessage(msg);
                    this.channel?.ack(msg);
                }
            });

            Logger.info('Connected to RabbitMQ');

            this.setupErrorHandlers();
        } catch (error) {
            Logger.error('Failed to connect to RabbitMQ:', error);
            throw error;
        }
    }

    private handleMessage(msg: ConsumeMessage): void {
        try {
            const content = msg.content.toString();
            Logger.debug('Received message:', { content });

            const story = JSON.parse(content) as Story;

            // Broadcast the single story
            this.wsService.broadcastStory(story);
            Logger.info(`Broadcasted story: ${story.title}`);
        } catch (error) {
            Logger.error('Error processing message:', error);
        }
    }

    private setupErrorHandlers(): void {
        this.connection?.on('error', (error) => {
            Logger.error('RabbitMQ connection error:', error);
        });

        this.connection?.on('close', () => {
            Logger.error('RabbitMQ connection closed, attempting to reconnect...',error);
            setTimeout(() => this.connect(), 5000);
        });
    }

    public async close(): Promise<void> {
        try {
            await this.channel?.close();
            await this.connection?.close();
        } catch (error) {
            Logger.error('Error closing RabbitMQ connection:', error);
        }
    }
}