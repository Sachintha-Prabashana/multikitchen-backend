import express from 'express';
import * as reviewController from '../controllers/reviewController.js';

const router = express.Router();

router.get('/', reviewController.getReviews);
router.post('/', reviewController.submitReview);

export default router;
