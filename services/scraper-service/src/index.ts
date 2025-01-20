import { ScraperService } from './services/scraper';
import { Logger } from './utils/logger';

class Application {
    private scraper: ScraperService;

    constructor() {
        this.scraper = new ScraperService();
    }

    async initialize(): Promise<void> {
        try {
            Logger.info('Starting scraper service...');
            await this.scraper.startPeriodicScraping();
        } catch (error) {
            Logger.error('Failed to initialize application:', error as Error);
            process.exit(1);
        }
    }

    async shutdown(): Promise<void> {
        try {
            await this.scraper.shutdown();
            Logger.info('Application shut down successfully');
        } catch (error) {
            Logger.error('Error during shutdown:', error as Error);
        }
    }
}

const app = new Application();

const handleShutdown = async (signal: string) => {
    Logger.info(`Received ${signal} signal. Starting graceful shutdown...`);
    await app.shutdown();
    process.exit(0);
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

app.initialize().catch((error: Error) => {
    Logger.error('Fatal error during initialization:', error);
    process.exit(1);
});