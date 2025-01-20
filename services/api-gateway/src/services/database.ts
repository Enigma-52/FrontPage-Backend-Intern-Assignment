import mysql from 'mysql2/promise';
import { Story } from '../models/types/story.types';
import { config } from '../config';
import { Logger } from '../utils/logger';
import { ApiError } from '../models/types/error.types';

export class DatabaseService {
    private pool: mysql.Pool;

    constructor() {
        this.pool = mysql.createPool({
            ...config.db,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }

    async getTopStories(page: number = 1, limit: number = config.api.defaultLimit): Promise<{ stories: Story[], total: number }> {
        const offset = (page - 1) * limit;
        try {
            const [stories] = await this.pool.query<mysql.RowDataPacket[]>(
                'SELECT * FROM stories ORDER BY score DESC LIMIT ? OFFSET ?',
                [limit, offset]
            );

            const [countResult] = await this.pool.query<mysql.RowDataPacket[]>(
                'SELECT COUNT(*) as total FROM stories'
            );

            return {
                stories: stories as Story[],
                total: countResult[0].total
            };
        } catch (error) {
            Logger.error('Failed to fetch top stories:', error);
            throw new ApiError(500, 'Failed to fetch stories');
        }
    }

    async getRecentStories(minutes: number = 5): Promise<Story[]> {
        try {
            const [stories] = await this.pool.query<mysql.RowDataPacket[]>(
                'SELECT * FROM stories WHERE published_at >= NOW() - INTERVAL ? MINUTE ORDER BY published_at DESC',
                [minutes]
            );
            return stories as Story[];
        } catch (error) {
            Logger.error('Failed to fetch recent stories:', error);
            throw new ApiError(500, 'Failed to fetch recent stories');
        }
    }

    async getStoryById(id: number): Promise<Story | null> {
        try {
            const [stories] = await this.pool.query<mysql.RowDataPacket[]>(
                'SELECT * FROM stories WHERE id = ?',
                [id]
            );
            return stories[0] as Story || null;
        } catch (error) {
            Logger.error(`Failed to fetch story ${id}:`, error);
            throw new ApiError(500, 'Failed to fetch story');
        }
    }
}