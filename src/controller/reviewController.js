const prisma = require("../prisma");
const Sentry = require('@sentry/node');


const getAllReviews = async (req, res, next) => {
    try {
        // retrieve all reviews
        const reviews = await prisma.review.findMany({
            include: {
                // user: true,
                property: true //retrieve the property details w/ the reviews
            }
        });
        res.status(200).json({ reviews });
    } catch (error) {
        next(error);
    }
};

const createReview = async (req, res, next) => {

    try {
        // creating a new review for a property
        const { userId, propertyId, rating, comment } = req.body;

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
        next(error);
    }
};


const getReviewById = async (req, res, next) => {

    try {
        // retrieve review from id
        const reviewId = req.params.id;

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
        next(error);
    }
};

const updateReview = async (req, res, next) => {


    try {

        const reviewId = req.params.id;
        const {rating, comment } = req.body;

        // validate if review exists
        const existingReview = await prisma.review.findUnique({
            where: {
                id: reviewId
            }
        });

        if (!existingReview) {
            return next({ message: 'Review not found' });
        }

        // update review or default to existing values
        const updatedReview = await prisma.review.update({
            where: {
                id: reviewId,
            },
            data: {
                rating: rating || existingReview.rating,
                comment: comment || existingReview.comment
            }
        });

        res.status(200).json({ message: 'Review updated successfully', review: updatedReview });

    } catch (error) {
        next(error);
    }
};

const deleteReview = async (req, res, next) => {

    try {
        // retrieve review and delete
        const reviewId = req.params.id;

        // find review w/ ID
        const existingReview = await prisma.review.findUnique({
            where: {
                id: reviewId
            }
        });

        if (!existingReview) {
            return next({ message: 'Review not found' });
        }

        await prisma.review.delete({
            where: {
                id: reviewId
            }
        });

        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = { createReview, getReviewById, updateReview, deleteReview, getAllReviews };
