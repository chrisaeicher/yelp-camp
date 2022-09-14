const express = require('express');
const router = express.Router({ mergeParams: true });

const ExpressError = require('../utilities/ExpressError');
const catchAsync = require('../utilities/catchAsync');

// Models
const Campground = require('../models/Campground');
const Review = require('../models/Review');

// Schemas
const { reviewSchema } = require('../schemas');

// Middleware functions
const validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(', ');
		throw new ExpressError(400, msg);
	} else {
		next();
	}
};

// Routes
router.post(
	'/',
	validateReview,
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id);
		const newReview = new Review(req.body.review);
		campground.reviews.push(newReview);
		newReview.save();
		campground.save();
		req.flash('success', 'Your review has been posted.');
		res.redirect(`/campgrounds/${campground.id}`);
	})
);

router.delete(
	'/:reviewId',
	catchAsync(async (req, res) => {
		const { id, reviewId } = req.params;
		await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
		await Review.findByIdAndDelete(reviewId);
		req.flash('success', 'Your comment has been deleted.');
		res.redirect(`/campgrounds/${id}`);
	})
);

module.exports = router;
