import { ExchangeConfig, ConnectionConfig } from '../models/types/queue.types';

export const rabbitmqConfig = {
    exchange: {
        name: 'hn_stories',
        type: 'fanout',
        options: {
            durable: false
        }
    } as ExchangeConfig,
    
    connection: {
        retryLimit: 5,
        retryInterval: 5000
    } as ConnectionConfig
};