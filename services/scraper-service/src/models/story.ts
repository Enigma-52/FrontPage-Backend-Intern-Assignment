import { HNStoryData, StoryDTO } from './types/story.types';

export class Story implements StoryDTO {
    public id: number;
    public title: string;
    public url?: string;
    public score: number;
    public author: string;
    public published_at: Date;
    public type: string;

    constructor(data: HNStoryData) {
        this.id = data.id;
        this.title = data.title;
        this.url = data.url;
        this.score = data.score;
        this.author = data.by;
        this.published_at = new Date(data.time * 1000);
        this.type = data.type;
    }

    public toJSON(): StoryDTO {
        return {
            id: this.id,
            title: this.title,
            url: this.url,
            score: this.score,
            author: this.author,
            published_at: this.published_at,
            type: this.type
        };
    }

    public static fromHNData(data: HNStoryData): Story {
        return new Story(data);
    }
}