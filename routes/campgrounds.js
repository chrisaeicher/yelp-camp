const express = require('express');
const router = express.Router();

// Middleware
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');

// Controllers
const {
	showAllCampgrounds,
	showNewCampgroundForm,
	submitNewCampground,
	showCampground,
	showEditCampgroundForm,
	submitCampgroundUpdates,
	deleteCampground,
} = require('../controllers/campgrounds');

// Routes
router
	.route('/')
	.get(showAllCampgrounds)
	.post(isLoggedIn, validateCampground, submitNewCampground);

router.route('/new').get(isLoggedIn, showNewCampgroundForm);

router
	.route('/:id')
	.get(showCampground)
	.put(isLoggedIn, isAuthor, submitCampgroundUpdates)
	.delete(isLoggedIn, isAuthor, deleteCampground);

router.route('/:id/edit').get(isLoggedIn, isAuthor, showEditCampgroundForm);

module.exports = router;
