import { Router } from 'express';
import storiesRouter from './stories';

const router = Router();

router.use('/stories', storiesRouter);

router.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

export default router;