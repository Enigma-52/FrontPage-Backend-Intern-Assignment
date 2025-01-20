import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import routes from './routes/index';
import { Logger } from './utils/logger';
import { ApiError } from './models/types/error.types';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    Logger.error('Error:', err);
    
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            error: err.message
        });
    }

    return res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

app.listen(config.port, () => {
    Logger.info(`API Gateway listening on port ${config.port}`);
});