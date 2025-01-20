export interface Story {
    id: number;
    title: string;
    url?: string;
    score: number;
    author: string;
    published_at: Date;
    created_at?: Date;
    type: string;
}