import { Request, Response, NextFunction } from 'express';
import { DatabaseService } from '../services/database';
import { config } from '../config';
import { Logger } from '../utils/logger';
import { ApiError } from '../models/types/error.types';
import { RecentStoriesResponse , ApiResponse } from '../models/types/api.types';

const db = new DatabaseService();

export const getTopStories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = Math.min(
            parseInt(req.query.limit as string) || config.api.defaultLimit,
            config.api.maxLimit
        );

        const { stories, total } = await db.getTopStories(page, limit);
        
        res.json({
            success: true,
            data: stories,
            meta: {
                page,
                limit,
                total
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getRecentStories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const timeWindow = parseInt(req.query.timeWindow as string) || 5;
        const stories = await db.getRecentStories(timeWindow);
        
        const response: ApiResponse<RecentStoriesResponse> = {
            success: true,
            data: {
                stories,
                count: stories.length,
                websocket: {
                    url: config.websocket.url,
                    protocol: config.websocket.protocol
                }
            },
            meta: {
                timeWindow
            }
        };

        Logger.info(`Returning ${stories.length} recent stories with WebSocket details`);
        res.json(response);
    } catch (error) {
        next(error);
    }
};

export const getStoryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            throw new ApiError(400, 'Invalid story ID');
        }

        const story = await db.getStoryById(id);
        if (!story) {
            throw new ApiError(404, 'Story not found');
        }

        res.json({
            success: true,
            data: story
        });
    } catch (error) {
        next(error);
    }
};