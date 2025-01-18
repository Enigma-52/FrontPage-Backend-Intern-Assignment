export class BaseError extends Error {
    public code: string;

    constructor(message: string, code: string) {
        super(message);
        this.code = code;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ScraperError extends BaseError {
    constructor(message: string, code = 'SCRAPER_ERROR') {
        super(message, code);
    }
}

export class QueueError extends BaseError {
    constructor(message: string, code = 'QUEUE_ERROR') {
        super(message, code);
    }
}