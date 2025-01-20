import axios from 'axios';
import { Story } from '../models/story';
import { Logger } from '../utils/logger';
import { ScraperError } from '../utils/errors';
import { config } from '../config';
import { DatabaseService } from './database';
import { RabbitMQService } from './queue';

export class ScraperService {
    private seenStories: Set<number>;
    private readonly apiBase: string;
    private database: DatabaseService;
    private rabbitmqService: RabbitMQService;

    constructor() {
        this.seenStories = new Set();
        this.apiBase = config.hn.apiBase;
        this.rabbitmqService = new RabbitMQService();
        this.database = new DatabaseService(this.rabbitmqService);
        Logger.info('Scraper service initialized');
    }

    async initialize(): Promise<void> {
        await this.rabbitmqService.initialize();
        Logger.info('RabbitMQ connection initialized');
    }

    async fetchStoryIds(): Promise<number[]> {
        try {
            const response = await axios.get<number[]>(`${this.apiBase}/newstories.json`);
            const limitedStories = response.data.slice(0, 10);
            Logger.info(`Fetched ${limitedStories.length} story IDs`);
            return limitedStories;
        } catch (error) {
            Logger.error('Failed to fetch story IDs:', error as Error);
            throw new ScraperError('Failed to fetch story IDs');
        }
    }

    async fetchStoryDetails(id: number): Promise<Story | null> {
        try {
            const response = await axios.get(`${this.apiBase}/item/${id}.json`);
            if (!response.data) return null;

            const story = {
                id: response.data.id,
                title: response.data.title,
                url: response.data.url,
                score: response.data.score,
                author: response.data.by,
                published_at: new Date(response.data.time * 1000),
                type: response.data.type
            };

            Logger.debug(`Fetched story: ${story.title}`);
            return story as Story;
        } catch (error) {
            Logger.error(`Failed to fetch story ${id}:`, error as Error);
            return null;
        }
    }

    async scrapeAndSave(): Promise<void> {
        try {
            Logger.info('Starting scrape cycle');
            const storyIds = await this.fetchStoryIds();
            let newStoriesCount = 0;

            for (const id of storyIds) {
                if (!this.seenStories.has(id)) {
                    const story = await this.fetchStoryDetails(id);
                    if (story) {
                        await this.database.saveStory(story);
                        this.seenStories.add(id);
                        newStoriesCount++;
                        Logger.info(`Saved story: ${story.title}`);
                    }
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }

            Logger.info(`Scrape cycle completed. Saved ${newStoriesCount} new stories`);
        } catch (error) {
            Logger.error('Error in scrape cycle:', error as Error);
            throw error;
        }
    }

    async startPeriodicScraping(): Promise<void> {
        await this.initialize();

        this.scrapeAndSave().catch(error => {
            Logger.error('Error in initial scrape:', error);
        });

        setInterval(() => {
            this.scrapeAndSave().catch(error => {
                Logger.error('Error in periodic scrape:', error);
            });
        }, config.app.scrapeInterval);

        Logger.info(`Periodic scraping started with interval ${config.app.scrapeInterval}ms`);
    }

    async shutdown(): Promise<void> {
        await this.rabbitmqService.close();
        await this.database.close();
    }
}