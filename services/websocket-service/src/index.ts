import { WebSocketService } from './services/websocket';
import { RabbitMQService } from './services/rabbitmq';
import { Logger } from './utils/logger';

class Application {
    private wsService: WebSocketService;
    private rabbitmqService: RabbitMQService;

    constructor() {
        this.wsService = new WebSocketService();
        this.rabbitmqService = new RabbitMQService(this.wsService);
    }

    async start(): Promise<void> {
        try {
            await this.rabbitmqService.connect();
            Logger.info('WebSocket service started successfully');

            process.on('SIGTERM', () => this.shutdown());
            process.on('SIGINT', () => this.shutdown());
        } catch (error) {
            Logger.error('Failed to start application:', error);
            process.exit(1);
        }
    }

    private async shutdown(): Promise<void> {
        Logger.info('Shutting down application...');
        await this.rabbitmqService.close();
        this.wsService.close();
        process.exit(0);
    }
}

const app = new Application();
app.start().catch((error) => {
    Logger.error('Fatal error during startup:', error);
    process.exit(1);
});