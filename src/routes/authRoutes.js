import express from 'express';
import { register, login, refresh, updateProfile } from '../controllers/authController.js';
import { authMiddleware, isAdminOrOwner } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', authMiddleware, isAdminOrOwner, register);
router.post('/login', login);
router.post('/refresh', refresh);
router.put('/profile', authMiddleware, updateProfile);

export default router;
