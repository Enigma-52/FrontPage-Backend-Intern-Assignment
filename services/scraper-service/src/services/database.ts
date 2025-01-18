import mysql from 'mysql2/promise';
import { Story } from '../models/story';
import { Logger } from '../utils/logger';

export class DatabaseService {
    private pool: mysql.Pool;

    constructor() {
        this.pool = mysql.createPool({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
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
            await this.pool.execute(query, [
                story.id,
                story.title,
                story.url || null,
                story.score,
                story.author,
                story.published_at,
                story.type
            ]);
        } catch (error) {
            Logger.error(`Failed to save story ${story.id}:`, error as Error);
            throw error;
        }
    }

    async saveStories(stories: Story[]): Promise<void> {
        for (const story of stories) {
            await this.saveStory(story);
        }
    }

    async close(): Promise<void> {
        await this.pool.end();
    }
}