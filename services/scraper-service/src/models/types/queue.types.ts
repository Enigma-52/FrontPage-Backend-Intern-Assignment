export interface QueueConfig {
    url: string;
    exchangeName: string;
    exchangeType: string;
    queueName?: string;
    routingKey?: string;
}

// Exchange configuration
export interface ExchangeConfig {
    name: string;
    type: 'direct' | 'fanout' | 'topic' | 'headers';
    options: {
        durable: boolean;
        autoDelete?: boolean;
        internal?: boolean;
        arguments?: any;
    };
}

// Connection configuration
export interface ConnectionConfig {
    retryLimit: number;
    retryInterval: number;
    heartbeatInterval?: number;
    reconnectTimeout?: number;
}

// Queue message types
export interface QueueMessage<T = unknown> {
    data: T;
    timestamp: Date;
    messageId: string;
}

// Published message configuration
export interface PublishOptions {
    persistent?: boolean;
    expiration?: string | number;
    messageId?: string;
    timestamp?: number;
    headers?: Record<string, unknown>;
}