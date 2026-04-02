import express from 'express';
import { createBackup, getBackups, restoreBackup } from '../controllers/backupController.js';
import { authMiddleware, isAdmin } from '../middleware/authMiddleware.js';
const router = express.Router();
router.post('/create', authMiddleware, isAdmin, createBackup);
router.get('/', authMiddleware, isAdmin, getBackups);
router.post('/restore', authMiddleware, isAdmin, restoreBackup);
export default router;
