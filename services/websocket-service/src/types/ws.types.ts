import WebSocket from 'ws';

export interface WSMessage {
    type: 'story' | 'stats' | 'error';
    data: any;
    timestamp: Date;
}

export interface WSClient extends WebSocket {
    isAlive: boolean;
    id: string;
}