const express = require('express');
const router = express.Router();
const Review = require('../models/review');
const Movie = require('../models/movie');
const User = require('../models/user');
const verifyToken = require('../middleware/verify-token');

// Create a new review
router.post('/', verifyToken, async (req, res) => {
    try {
        const { movieId, comment, rating } = req.body;
        console.log(movieId, comment, rating);
        const review = new Review({
            user: req.user.userId,
            movie: movieId,
            comment,
            rating
        });
        await review.save();

        // Update movie's reviews and recalculate average rating
        const movie = await Movie.findById(movieId);
        movie.reviews.push(review._id);
        const reviews = await Review.find({ movie: movieId });
        const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
        movie.averageRating = avgRating;
        await movie.save();

        // Add review to user's reviews
        await User.findByIdAndUpdate(req.user.userId, { $push: { reviews: review._id } });

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the review' });
    }
});

// Get all reviews for a specific movie
router.get('/movie/:movieId', async (req, res) => {
    try {
        const reviews = await Review.find({ movie: req.params.movieId })
            .populate('user', 'username')
            .sort('-createdAt');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching reviews' });
    }
});

// Get a specific review
router.get('/:reviewId', async (req, res) => {
    try {
        const review = await Review.findById(req.params.reviewId).populate('user', 'username');
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }
        res.json(review);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the review' });
    }
});

// Update a review
router.put('/:reviewId', verifyToken, async (req, res) => {
    try {
        const { comment, rating } = req.body;
        const review = await Review.findOneAndUpdate(
            { _id: req.params.reviewId, user: req.user.userId },
            { comment, rating },
            { new: true }
        );
        if (!review) {
            return res.status(404).json({ error: 'Review not found or you are not authorized to update it' });
        }

        // Recalculate movie's average rating
        const movie = await Movie.findById(review.movie);
        const reviews = await Review.find({ movie: review.movie });
        const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
        movie.averageRating = avgRating;
        await movie.save();

        res.json(review);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the review' });
    }
});

// Delete a review
router.delete('/:reviewId', verifyToken, async (req, res) => {
    try {
        const review = await Review.findOneAndDelete({ _id: req.params.reviewId, user: req.user.userId });
        if (!review) {
            return res.status(404).json({ error: 'Review not found or you are not authorized to delete it' });
        }

        // Remove review from movie's reviews and recalculate average rating
        const movie = await Movie.findById(review.movie);
        movie.reviews = movie.reviews.filter(r => r.toString() !== req.params.reviewId);
        const reviews = await Review.find({ movie: review.movie });
        const avgRating = reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
        movie.averageRating = avgRating;
        await movie.save();

        // Remove review from user's reviews
        await User.findByIdAndUpdate(req.user.userId, { $pull: { reviews: req.params.reviewId } });

        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the review' });
    }
});

module.exports = router;