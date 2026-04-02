import express from 'express';
import { getUsers, updateRole, removeUser } from '../controllers/userController.js';
import { authMiddleware, isAdminOrOwner } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, isAdminOrOwner, getUsers);
router.put('/:id', authMiddleware, isAdminOrOwner, updateRole);
router.delete('/:id', authMiddleware, isAdminOrOwner, removeUser);

export default router;
