import express from 'express';
import {
    getInsights,
    generateInsight,
    deleteInsight,
} from '../controllers/insightController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getInsights);
router.post('/generate', generateInsight);
router.delete('/:id', deleteInsight);

export default router;
