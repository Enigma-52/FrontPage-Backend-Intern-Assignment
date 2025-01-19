import { config } from './config';
import { ScraperService } from './services/scraper';
import { Logger } from './utils/logger';

class Application {
    private readonly scraper: ScraperService;

    constructor() {
        this.scraper = new ScraperService();
    }

    async initialize(): Promise<void> {
        try {
            Logger.info('Starting scraper service...');
            this.scraper.startPeriodicScraping();
        } catch (error) {
            Logger.error('Failed to initialize application:', error as Error);
            process.exit(1);
        }
    }
}

// Handle process termination
const handleShutdown = (signal: string) => {
    Logger.info(`Received ${signal} signal. Shutting down...`);
    process.exit(0);
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

// Start the application
const application = new Application();
application.initialize().catch((error: Error) => {
    Logger.error('Fatal error during initialization:', error);
    process.exit(1);
});