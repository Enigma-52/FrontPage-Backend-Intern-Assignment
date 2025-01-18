interface LogMeta {
    [key: string]: unknown;
}

export class Logger {
    static info(message: string, meta: LogMeta = {}): void {
        console.log(new Date().toISOString(), 'INFO:', message, meta);
    }

    static error(message: string, error: Error | null = null): void {
        console.error(new Date().toISOString(), 'ERROR:', message, error);
    }

    static debug(message: string, meta: LogMeta = {}): void {
        if (process.env.NODE_ENV === 'development') {
            console.debug(new Date().toISOString(), 'DEBUG:', message, meta);
        }
    }
}