const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authentication');
const { ErrorHandler } = require('../middleware/ErrorHandler');
const { getAllReviews, createReview, getReviewById, updateReview, deleteReview } = require('../controller/reviewController');

//Review Routes
router.get('/', getAllReviews, ErrorHandler);
router.post('/', authenticateToken, createReview, ErrorHandler);
router.get('/:id', getReviewById, ErrorHandler);
router.put('/:id', authenticateToken, updateReview, ErrorHandler);
router.delete('/:id', authenticateToken, deleteReview, ErrorHandler);

module.exports = router