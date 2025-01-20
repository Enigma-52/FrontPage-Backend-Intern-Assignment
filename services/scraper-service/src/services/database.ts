import mysql from 'mysql2/promise';
import { Story } from '../models/story';
import { Logger } from '../utils/logger';
import { RabbitMQService } from './queue';

export class DatabaseService {
    private pool: mysql.Pool;
    private rabbitmqService: RabbitMQService;

    constructor(rabbitmqService: RabbitMQService) {
        this.pool = mysql.createPool({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
        this.rabbitmqService = rabbitmqService;
        Logger.info('Database service initialized', { 
            host: process.env.MYSQL_HOST,
            database: process.env.MYSQL_DATABASE 
        });
    }

    private async checkStoryExists(id: number): Promise<boolean> {
        const [rows] = await this.pool.execute(
            'SELECT 1 FROM stories WHERE id = ?',
            [id]
        );
        return (rows as any[]).length > 0;
    }

    async saveStory(story: Story): Promise<void> {
        const query = `
            INSERT INTO stories (id, title, url, score, author, published_at, type)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            score = VALUES(score),
            title = VALUES(title),
            url = VALUES(url)
        `;

        try {
            Logger.debug(`Attempting to save story ${story.id}`);
            
            // Check if story exists before saving
            const exists = await this.checkStoryExists(story.id);
            
            await this.pool.execute(query, [
                story.id,
                story.title,
                story.url || null,
                story.score,
                story.author,
                story.published_at,
                story.type
            ]);
            
            // If story didn't exist before, publish to RabbitMQ
            if (!exists) {
                Logger.info(`New story detected: ${story.id}, publishing to RabbitMQ`);
                await this.rabbitmqService.publishStory(story);
            }

            Logger.debug(`Successfully saved story ${story.id}`);
        } catch (error) {
            Logger.error(`Failed to save story ${story.id}:`, error as Error);
            throw error;
        }
    }

    async saveStories(stories: Story[]): Promise<void> {
        Logger.info(`Attempting to save ${stories.length} stories`);
        
        // Use transaction for bulk insert
        const connection = await this.pool.getConnection();
        try {
            await connection.beginTransaction();
            
            for (const story of stories) {
                await this.saveStory(story);
            }
            
            await connection.commit();
            Logger.info(`Successfully saved ${stories.length} stories`);
        } catch (error) {
            await connection.rollback();
            Logger.error('Failed to save stories batch:', error as Error);
            throw error;
        } finally {
            connection.release();
        }
    }

    async close(): Promise<void> {
        await this.pool.end();
    }
}