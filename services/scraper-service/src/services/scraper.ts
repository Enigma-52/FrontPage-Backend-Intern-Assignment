import axios from 'axios';
import { Story } from '../models/story';
import { HNStoryData } from '../models/types/story.types';
import { Logger } from '../utils/logger';
import { ScraperError } from '../utils/errors';
import { config } from '../config';

export class ScraperService {
    private seenStories: Set<number>;
    private readonly apiBase: string;

    constructor() {
        this.seenStories = new Set();
        this.apiBase = config.hn.apiBase;
    }

    public async fetchStoryIds(): Promise<number[]> {
        try {
            const response = await axios.get<number[]>(`${this.apiBase}/newstories.json`);
            return response.data;
        } catch (error) {
            throw new ScraperError('Failed to fetch story IDs');
        }
    }

    public async fetchStoryDetails(id: number): Promise<Story | null> {
        try {
            const response = await axios.get<HNStoryData>(`${this.apiBase}/item/${id}.json`);
            if (!response.data) return null;
            return Story.fromHNData(response.data);
        } catch (error) {
            Logger.error(`Failed to fetch story ${id}:`, error as Error);
            return null;
        }
    }

    public async getNewStories(): Promise<Story[]> {
        const storyIds = await this.fetchStoryIds();
        const newStories: Story[] = [];
        
        for (const id of storyIds) {
            if (this.seenStories.has(id)) continue;
            
            const story = await this.fetchStoryDetails(id);
            if (story) {
                this.seenStories.add(id);
                newStories.push(story);
            }
            
            await new Promise(resolve => setTimeout(resolve, config.hn.rateLimit));
        }

        return newStories;
    }
}