const express = require('express');
const router = express.Router();

// Models
const Campground = require('../models/Campground');

// Schemas
const { campgroundSchema } = require('../schemas');

// Utilities
const ExpressError = require('../utilities/ExpressError');
const catchAsync = require('../utilities/catchAsync');

// Middleware functions
const validateCampground = (req, res, next) => {
	const { error } = campgroundSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(', ');
		throw new ExpressError(400, msg);
	} else {
		next();
	}
};

// Routes
router.get(
	'/',
	catchAsync(async (req, res) => {
		const campgrounds = await Campground.find({});
		res.render('campgrounds/index', { campgrounds });
	})
);

router.get('/new', (req, res) => {
	res.render('campgrounds/new');
});

router.post(
	'/',
	validateCampground,
	catchAsync(async (req, res, next) => {
		const newCamp = new Campground(req.body.campground);
		await newCamp.save();
		req.flash('success', 'Successfully made a new campground!');
		res.redirect(`campgrounds/${newCamp._id}`);
	})
);

router.get(
	'/:id',
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id).populate(
			'reviews'
		);
		if (!campground) {
			req.flash('error', "We couldn't find that campground.");
			return res.redirect('/campgrounds');
		}
		res.render('campgrounds/show', { campground });
	})
);

router.get(
	'/:id/edit',
	catchAsync(async (req, res) => {
		const { id } = req.params.id;
		const campground = await Campground.findById(id);
		if (!campground) {
			req.flash('error', "We couldn't find that campground.");
			return res.redirect('/campgrounds');
		}
		res.render('campgrounds/edit', { campground });
	})
);

router.put(
	'/:id',
	catchAsync(async (req, res) => {
		const { id } = req.params.id;
		await Campground.findByIdAndUpdate(id, {
			...req.body.campground,
		});
		req.flash('success', 'Successfully updated campground information.');
		res.redirect(`/campgrounds/${req.params.id}`);
	})
);

router.delete(
	'/:id',
	catchAsync(async (req, res) => {
		const { id } = req.params.id;
		await Campground.findByIdAndDelete(id);
		req.flash('success', `Deleted the requested campground.`);
		res.redirect('/campgrounds');
	})
);

module.exports = router;
