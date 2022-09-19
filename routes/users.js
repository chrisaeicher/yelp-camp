const express = require('express');
const router = express.Router();

// Middleware
const { isLoggedIn } = require('../middleware');
const passport = require('passport');

// Controllers
const {
	showRegisterForm,
	registerUser,
	showLoginForm,
	loginUser,
	logoutUser,
} = require('../controllers/users');

// Routes
router.route('/register').get(showRegisterForm).post(registerUser);

router
	.route('/login')
	.get(showLoginForm)
	.post(
		passport.authenticate('local', {
			failureFlash: true,
			failureRedirect: '/login',
			keepSessionInfo: true,
		}),
		loginUser
	);

router.route('/logout').get(isLoggedIn, logoutUser);

module.exports = router;
