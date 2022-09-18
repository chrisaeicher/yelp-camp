// Models
const User = require('../models/User');

// Utilities
const catchAsync = require('../utilities/catchAsync');

module.exports = {
	showRegisterForm: (req, res) => {
		res.render('users/register');
	},
	registerUser: catchAsync(async (req, res, next) => {
		try {
			const { email, username, password } = req.body;
			const user = new User({ email, username });
			const regUser = await User.register(user, password);
			req.login(regUser, (err) => {
				if (err) return next(err);
				req.flash('success', 'Welcome to YelpCamp!');
				res.redirect('/campgrounds');
			});
		} catch (err) {
			req.flash('error', err.message);
			res.redirect('/register');
		}
	}),
	showLoginForm: (req, res) => {
		res.render('users/login');
	},
	loginUser: catchAsync(async (req, res, next) => {
		req.flash('success', `Welcome back, ${req.user.username}!`);
		const redirectUrl = req.session.returnTo || '/campgrounds';
		delete req.session.returnTo;
		res.redirect(redirectUrl);
	}),
	logoutUser: (req, res) => {
		req.logout((err) => {
			if (err) {
				return next(err);
			}
			req.flash('success', 'Successfully logged out.');
			res.redirect('/campgrounds');
		});
	},
};
