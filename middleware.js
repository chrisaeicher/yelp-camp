const Campground = require('./models/Campground');
const Review = require('./models/Review');
const { campgroundSchema, reviewSchema } = require('./schemas');
const ExpressError = require('./utilities/ExpressError');

module.exports.validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(', ');
		throw new ExpressError(400, msg);
	} else {
		next();
	}
};

module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.session.returnTo = req.originalUrl;
		req.flash('error', 'You must be signed in to access that page.');
		return res.redirect('/login');
	}
	next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
	const { id, reviewId } = req.params;
	const review = await Review.findById(reviewId);
	if (!review.author.equals(req.user.id)) {
		req.flash('error', 'You do not have permission to do that.');
		return res.redirect(`/campgrounds/${id}`);
	}
	next();
};
module.exports.isAuthor = async (req, res, next) => {
	const { id } = req.params;
	const campground = await Campground.findById(id);
	if (!campground.author.equals(req.user.id)) {
		req.flash('error', 'You do not have permission to do that.');
		return res.redirect(`/campgrounds/${id}`);
	}
	next();
};

module.exports.validateCampground = (req, res, next) => {
	const { error } = campgroundSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(', ');
		throw new ExpressError(400, msg);
	} else {
		next();
	}
};
