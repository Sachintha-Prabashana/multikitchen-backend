import express from 'express';
import * as brandController from '../controllers/brandController.js';
import { authMiddleware, isAdmin } from '../middleware/authMiddleware.js';
const router = express.Router();
router.get('/', authMiddleware, brandController.getBrands);
router.post('/', authMiddleware, isAdmin, brandController.createBrand);
export default router;
