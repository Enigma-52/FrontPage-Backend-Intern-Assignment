import dotenv from 'dotenv';
import { QueueConfig } from '../models/types/queue.types';

dotenv.config();

interface AppConfig {
    scrapeInterval: number;
    nodeEnv: string;
}

interface HNConfig {
    apiBase: string;
    rateLimit: number;
}

interface Config {
    app: AppConfig;
    hn: HNConfig;
    rabbitmq: QueueConfig;
}

export const config: Config = {
    app: {
        scrapeInterval: parseInt(process.env.SCRAPE_INTERVAL || '300000', 10),
        nodeEnv: process.env.NODE_ENV || 'development'
    },
    hn: {
        apiBase: 'https://hacker-news.firebaseio.com/v0',
        rateLimit: parseInt(process.env.HN_RATE_LIMIT || '100', 10)
    },
    rabbitmq: {
        url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
        exchangeName: 'hn_stories',
        exchangeType: 'fanout'
    }
};