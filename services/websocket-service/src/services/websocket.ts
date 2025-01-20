import { WebSocketServer, WebSocket } from 'ws';
import { config } from '../config';
import { Logger } from '../utils/logger';
import { WSMessage, WSClient } from '../types/ws.types';
import { Story } from '../types/story.types';

export class WebSocketService {
    private wss: WebSocketServer;
    private interval: NodeJS.Timeout | null = null;

    constructor() {
        this.wss = new WebSocketServer({ port: config.port });
        this.setupWSS();
        Logger.info(`WebSocket server started on port ${config.port}`);
    }

    private setupWSS(): void {
        this.wss.on('connection', (ws: WebSocket) => {
            const client = ws as WSClient;
            client.isAlive = true;
            client.id = Math.random().toString(36).substring(7);
            
            Logger.info(`Client connected: ${client.id}`);

            client.on('pong', () => {
                client.isAlive = true;
            });

            client.on('error', (error: Error) => {
                Logger.error(`WebSocket error for client ${client.id}:`, error);
            });

            client.on('close', () => {
                Logger.info(`Client disconnected: ${client.id}`);
            });
        });

        this.startHeartbeat();
    }

    private startHeartbeat(): void {
        this.interval = setInterval(() => {
            this.wss.clients.forEach((ws: WebSocket) => {
                const client = ws as WSClient;
                if (client.isAlive === false) {
                    Logger.info(`Terminating inactive client: ${client.id}`);
                    return client.terminate();
                }

                client.isAlive = false;
                client.ping(() => {});
            });
        }, config.ws.pingInterval);

        this.wss.on('close', () => {
            if (this.interval) {
                clearInterval(this.interval);
            }
        });
    }

    public broadcastStory(story: Story): void {
        const message: WSMessage = {
            type: 'story',
            data: story,
            timestamp: new Date()
        };

        this.broadcast(message);
    }

    private broadcast(message: WSMessage): void {
        const data = JSON.stringify(message);
        let clientCount = 0;

        this.wss.clients.forEach((ws: WebSocket) => {
            const client = ws as WSClient;
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
                clientCount++;
            }
        });

        Logger.info(`Broadcasted message to ${clientCount} clients`, { 
            messageType: message.type 
        });
    }

    public close(): void {
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.wss.close(() => {
            Logger.info('WebSocket server closed');
        });
    }
}