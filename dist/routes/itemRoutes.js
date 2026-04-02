import express from 'express';
import { getItems, createItem, updateItem, deleteItem } from '../controllers/itemController.js';
import { authMiddleware, isAdmin } from '../middleware/authMiddleware.js';
const router = express.Router();
router.get('/', authMiddleware, getItems);
router.post('/', authMiddleware, isAdmin, createItem);
router.put('/:id', authMiddleware, isAdmin, updateItem);
router.delete('/:id', authMiddleware, isAdmin, deleteItem);
export default router;
