const prisma = require("../prisma");

// Create a new review
const createReview = async (req, res,next) => {
    const { userId, propertyId, rating, comment } = req.body;

    try {
        const newReview = await prisma.review.create({
            data: {
                userId,
                propertyId,
                rating,
                comment
            }
        });

        res.status(201).json({ message: 'Review created successfully', review: newReview });
    } catch (error) {
        console.error('Error creating review:', error);
       return next({ error: 'Internal Server Error' });
    }
};

// Get a review by ID
const getReviewById = async (req, res,next) => {
    const reviewId = req.params.id;

    try {
        const review = await prisma.review.findUnique({
            where: {
                id: reviewId,
            },
        });

        if (!review) {
            return next({ message: 'Review not found' });
        }

        res.status(200).json({ review });
    } catch (error) {
        console.error('Error retrieving review:', error);
       return next({ error: 'Internal Server Error' });
    }
};

// Update a review
const updateReview = async (req, res,next) => {
    const reviewId = req.params.id;
    const { userId, propertyId, rating, comment } = req.body;

    try {
        const updatedReview = await prisma.review.update({
            where: { id: reviewId },
            data: {
                userId,
                propertyId,
                rating,
                comment
            }
        });

        res.status(200).json({ message: 'Review updated successfully', review: updatedReview });
    } catch (error) {
        console.error('Error updating review:', error);
       return next({ error: 'Internal Server Error' });
    }
};

// Delete a review
const deleteReview = async (req, res,next) => {
    const reviewId = req.params.id;

    try {
        await prisma.review.delete({
            where: { id: reviewId }
        });

        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Error deleting review:', error);
       return next({ error: 'Internal Server Error' });
    }
};
const getAllReviews = async (req, res,next) => {
    try {
        
        const reviews = await prisma.review.findMany({
            include: {
                user: true, 
                property: true 
            }
        });
        res.status(200).json({ reviews });
    } catch (error) {
        console.error('Error retrieving reviews:', error);
       return next({ error: 'Internal Server Error' });
    }
};
module.exports = { createReview, getReviewById, updateReview, deleteReview,getAllReviews };
