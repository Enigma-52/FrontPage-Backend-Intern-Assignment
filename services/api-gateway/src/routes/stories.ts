import { Router } from 'express';
import { getTopStories, getRecentStories, getStoryById } from '../controllers/stories';

const router = Router();

router.get('/top', getTopStories);
router.get('/recent', getRecentStories);
router.get('/:id', getStoryById);

export default router;