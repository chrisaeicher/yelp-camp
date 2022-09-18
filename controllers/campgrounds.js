const catchAsync = require('../utilities/catchAsync');

// Models
const Campground = require('../models/Campground');

module.exports = {
	showAllCampgrounds: catchAsync(async (req, res) => {
		const campgrounds = await Campground.find({});
		res.render('campgrounds/index', { campgrounds });
	}),
	showNewCampgroundForm: (req, res) => {
		res.render('campgrounds/new');
	},
	submitNewCampground: catchAsync(async (req, res, next) => {
		const newCamp = new Campground(req.body.campground);
		newCamp.author = req.user.id;
		await newCamp.save();
		req.flash('success', 'Successfully made a new campground!');
		res.redirect(`campgrounds/${newCamp._id}`);
	}),
	showCampground: catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findById(id)
			.populate({
				path: 'reviews',
				populate: {
					path: 'author',
				},
			})
			.populate('author');
		if (!campground) {
			req.flash('error', "We couldn't find that campground.");
			return res.redirect('/campgrounds');
		}
		res.render('campgrounds/show', { campground });
	}),
	showEditCampgroundForm: catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findById(id);
		console.log(campground);
		if (!campground) {
			req.flash('error', "We couldn't find that campground.");
			return res.redirect('/campgrounds');
		}
		res.render('campgrounds/edit', { campground });
	}),
	submitCampgroundUpdates: catchAsync(async (req, res) => {
		const { id } = req.params;
		await Campground.findByIdAndUpdate(id, {
			...req.body.campground,
		});
		req.flash('success', 'Successfully updated campground information.');
		res.redirect(`/campgrounds/${req.params.id}`);
	}),
	deleteCampground: catchAsync(async (req, res) => {
		const { id } = req.params;
		await Campground.findByIdAndDelete(id);
		req.flash('success', `Deleted the requested campground.`);
		res.redirect('/campgrounds');
	}),
};
