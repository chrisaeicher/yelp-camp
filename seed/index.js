// Mongoose setup
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('Successfully connected to database.');
});

// Model imports
const Campground = require('../models/Campground');
const Review = require('../models/Review');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

const seedDB = async () => {
	await Review.deleteMany({});
	await Campground.deleteMany({});
	const campgrounds = [];
	for (let i = 0; i < 15; i++) {
		const rand1000 = Math.floor(Math.random() * 1000);
		const randPrice = Math.floor(Math.random() * 35) + 15;
		const camp = new Campground({
			location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
			title: `${descriptors[rand1000 % descriptors.length]} ${
				places[rand1000 % places.length]
			}`,
			description:
				'Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem explicabo aut aliquam minus natus aliquid necessitatibus, expedita vero modi incidunt beatae sit, ab facilis.',
			image: '/',
			price: randPrice,
			reviews: [],
		});
		campgrounds.push(camp);
	}
	Campground.insertMany(campgrounds);
};

seedDB().then(() => {
	mongoose.connection.close();
});
