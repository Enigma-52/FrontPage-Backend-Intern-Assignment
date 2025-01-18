export interface HNStoryData {
    id: number;
    title: string;
    url?: string;
    score: number;
    by: string;
    time: number;
    type: 'story' | 'job' | 'comment' | 'poll' | 'pollopt';
    descendants?: number;
    kids?: number[];
    deleted?: boolean;
    dead?: boolean;
    text?: string;
    parent?: number;
    poll?: number;
    parts?: number[];
}

// Processed story data for our application
export interface StoryDTO {
    id: number;
    title: string;
    url?: string;
    score: number;
    author: string;
    published_at: Date;
    type: string;
    created_at?: Date;
}

// Response type for story list
export interface StoriesResponse {
    stories: StoryDTO[];
    total: number;
    timestamp: Date;
}