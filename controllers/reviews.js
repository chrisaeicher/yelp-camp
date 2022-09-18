// Models
const Campground = require('../models/Campground');
const Review = require('../models/Review');

// Utilities
const catchAsync = require('../utilities/catchAsync');

module.exports = {
	submitNewReview: catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id);
		const newReview = new Review(req.body.review);
		newReview.author = req.user.id;
		campground.reviews.push(newReview);
		await newReview.save();
		await campground.save();
		req.flash('success', 'Your review has been posted.');
		res.redirect(`/campgrounds/${campground.id}`);
	}),
	deleteReview: catchAsync(async (req, res) => {
		const { id, reviewId } = req.params;
		await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
		await Review.findByIdAndDelete(reviewId);
		req.flash('success', 'Your comment has been deleted.');
		res.redirect(`/campgrounds/${id}`);
	}),
};
