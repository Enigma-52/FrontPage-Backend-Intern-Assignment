// src/index.ts
import { config } from './config';
import { ScraperService } from './services/scraper';
import { DatabaseService } from './services/database';
import { Logger } from './utils/logger';

class Application {
    private readonly scraper: ScraperService;
    private readonly database: DatabaseService;

    constructor() {
        this.scraper = new ScraperService();
        this.database = new DatabaseService();
    }

    async initialize(): Promise<void> {
        try {
            Logger.info('Starting scraper service...');
            await this.startScraping();
        } catch (error) {
            Logger.error('Failed to initialize application:', error as Error);
            process.exit(1);
        }
    }

    private async startScraping(): Promise<void> {
        // Initial scrape
        await this.runScrapingCycle();

        // Setup interval
        setInterval(
            () => this.runScrapingCycle(),
            config.app.scrapeInterval
        );
    }

    private async runScrapingCycle(): Promise<void> {
        try {
            const stories = await this.scraper.getNewStories();
            if (stories.length > 0) {
                await this.database.saveStories(stories);
                Logger.info(`Saved ${stories.length} new stories to database`);
            }
        } catch (error) {
            Logger.error('Error in scraping cycle:', error as Error);
        }
    }

    public async shutdown(): Promise<void> {
        Logger.info('Shutting down application...');
        await this.database.close();
    }
}

// Handle process termination
const handleShutdown = async (signal: string) => {
    Logger.info(`Received ${signal} signal`);
    await application.shutdown();
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