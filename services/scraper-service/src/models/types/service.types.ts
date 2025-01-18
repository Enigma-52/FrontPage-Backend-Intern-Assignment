import { Story } from '../story';
import { QueueMessage } from './queue.types';
import { PublishOptions } from './queue.types';

// Scraper service interface
export interface IScraperService {
    fetchStoryIds(): Promise<number[]>;
    fetchStoryDetails(id: number): Promise<Story | null>;
    getNewStories(): Promise<Story[]>;
}

// Queue service interface
export interface IQueueService {
    connect(): Promise<void>;
    publish<T>(data: T, options?: PublishOptions): Promise<boolean>;
    close(): Promise<void>;
}

// Types for service events
export type ServiceEvent = {
    type: 'start' | 'stop' | 'error' | 'warning' | 'info';
    timestamp: Date;
    data?: unknown;
};

// Service status enum
export enum ServiceStatus {
    STARTING = 'STARTING',
    RUNNING = 'RUNNING',
    STOPPING = 'STOPPING',
    STOPPED = 'STOPPED',
    ERROR = 'ERROR'
}

// Service health check response
export interface HealthCheck {
    status: ServiceStatus;
    uptime: number;
    timestamp: Date;
    checks: {
        queue: boolean;
        api: boolean;
        scraper: boolean;
    };
    meta?: Record<string, unknown>;
}

// Types for message processing
export type MessageHandler<T> = (message: QueueMessage<T>) => Promise<void>;

export interface ServiceOptions {
    retryAttempts?: number;
    retryDelay?: number;
    timeout?: number;
    enableMetrics?: boolean;
}