import express from 'express';
import { getStockReport, getDailyReport, getMonthlyReport, exportStockReport, getAggregatedReport, exportIssueSlip } from '../controllers/reportController.js';
import { authMiddleware, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stock', authMiddleware, getStockReport);
router.get('/daily', authMiddleware, getDailyReport);
router.get('/monthly', authMiddleware, isAdmin, getMonthlyReport);
router.get('/summary', authMiddleware, getAggregatedReport);
router.get('/export', authMiddleware, exportStockReport);
router.post('/issue-slip', authMiddleware, exportIssueSlip);

export default router;
