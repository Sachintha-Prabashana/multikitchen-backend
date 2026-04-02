import prisma from '../lib/prisma.js';

export const getReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { status: 'APPROVED' },
      orderBy: { created_at: 'desc' }
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

export const submitReview = async (req, res) => {
  const { name, rating, comment } = req.body;
  try {
    const review = await prisma.review.create({
      data: { 
        name, 
        rating: parseInt(rating), 
        comment,
        status: 'APPROVED' // Auto-approve for now as per user trust
      }
    });
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ error: 'Failed to submit review' });
  }
};
