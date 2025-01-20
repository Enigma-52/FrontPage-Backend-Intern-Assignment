export class Logger {
    static info(message: string, meta: object = {}) {
        console.log(new Date().toISOString(), 'INFO:', message, meta);
    }

    static error(message: string, error: unknown) {
        console.error(new Date().toISOString(), 'ERROR:', message, error);
    }

    static debug(message: string, meta: object = {}) {
        if (process.env.NODE_ENV === 'development') {
            console.debug(new Date().toISOString(), 'DEBUG:', message, meta);
        }
    }
}

