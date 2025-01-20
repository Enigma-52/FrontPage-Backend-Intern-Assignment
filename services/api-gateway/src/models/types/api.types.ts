export interface Story {
    id: number;
    title: string;
    url?: string;
    score: number;
    author: string;
    published_at: Date;
}

export interface RecentStoriesResponse {
    stories: Story[];
    count: number;
    websocket: {
        url: string;
        protocol: string;
    };
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    error?: string;
    meta?: {
        count?: number;
        timeWindow?: number;
    };
}