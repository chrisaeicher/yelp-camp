const express = require('express');
const router = express.Router({ mergeParams: true });

// Controllers
const { submitNewReview, deleteReview } = require('../controllers/reviews');

// Middleware
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

// Routes
router.route('/').post(isLoggedIn, validateReview, submitNewReview);

router.route('/:reviewId').delete(isLoggedIn, isReviewAuthor, deleteReview);

module.exports = router;
