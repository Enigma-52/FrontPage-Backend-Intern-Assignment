import { QueueConfig } from './queue.types';
export interface AppConfig {
    nodeEnv: 'development' | 'production' | 'test';
    scrapeInterval: number;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
}

// Hacker News API configuration
export interface HNConfig {
    apiBase: string;
    rateLimit: number;
    timeout: number;
    maxRetries: number;
    concurrentRequests: number;
}

// Database configuration
export interface DBConfig {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    ssl?: boolean;
    connectionLimit?: number;
}

// Combined configuration type
export interface Config {
    app: AppConfig;
    hn: HNConfig;
    rabbitmq: QueueConfig;
    redis?: {
        url: string;
        ttl: number;
    };
}