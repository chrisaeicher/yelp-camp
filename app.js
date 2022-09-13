// Package imports
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utilities/ExpressError');
const catchAsync = require('./utilities/catchAsync');

// Express setup
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Mongoose setup
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('Successfully connected to database.');
});

// Models
const Campground = require('./models/Campground');
const { campgroundSchema } = require('./schemas');

const Review = require('./models/Review');
const { reviewSchema } = require('./schemas');

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
app.get('/', (req, res) => {
	res.render('home');
});

app.get(
	'/campgrounds',
	catchAsync(async (req, res) => {
		const campgrounds = await Campground.find({});
		res.render('campgrounds/index', { campgrounds });
	})
);

app.get('/campgrounds/new', (req, res) => {
	res.render('campgrounds/new');
});

app.post(
	'/campgrounds',
	validateCampground,
	catchAsync(async (req, res, next) => {
		const newCamp = new Campground(req.body.campground);
		await newCamp.save();
		res.redirect(`campgrounds/${newCamp._id}`);
	})
);

app.get(
	'/campgrounds/:id',
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id).populate(
			'reviews'
		);
		res.render('campgrounds/show', { campground });
	})
);

app.get(
	'/campgrounds/:id/edit',
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id);
		res.render('campgrounds/edit', { campground });
	})
);

app.put(
	'/campgrounds/:id',
	catchAsync(async (req, res) => {
		await Campground.findByIdAndUpdate(req.params.id, {
			...req.body.campground,
		});
		res.redirect(`/campgrounds/${req.params.id}`);
	})
);

app.delete(
	'/campgrounds/:id',
	catchAsync(async (req, res) => {
		await Campground.findByIdAndDelete(req.params.id);
		res.redirect('/campgrounds');
	})
);

app.post(
	'/campgrounds/:id/reviews',
	validateReview,
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id);
		const newReview = new Review(req.body.review);
		campground.reviews.push(newReview);
		newReview.save();
		campground.save();
		res.redirect(`/campgrounds/${campground.id}`);
	})
);

app.all('*', (req, res, next) => {
	next(new ExpressError(404, 'Page Not Found'));
});

app.use((err, req, res, next) => {
	const { status = 500, message = 'Oh no! Something went wrong.' } = err;
	res.status(status).render('error', { status, message });
});

app.listen(port, () => {
	console.log(`App online at port ${port}`);
});
