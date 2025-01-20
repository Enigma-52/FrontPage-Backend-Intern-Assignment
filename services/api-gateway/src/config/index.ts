import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: parseInt(process.env.PORT || '3000', 10),
    db: {
        host: process.env.MYSQL_HOST || 'localhost',
        user: process.env.MYSQL_USER || 'app_user',
        password: process.env.MYSQL_PASSWORD || 'app_pass',
        database: process.env.MYSQL_DATABASE || 'scraper_db',
        port: parseInt(process.env.MYSQL_PORT || '3306', 10)
    },
    websocket: {
        url: process.env.WEBSOCKET_URL || 'ws://localhost:8000',
        protocol: process.env.WEBSOCKET_PROTOCOL || 'ws'  
    },
    api: {
        defaultLimit: 20,
        maxLimit: 100
    }
};