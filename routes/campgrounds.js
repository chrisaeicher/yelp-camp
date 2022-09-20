const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage: storage });

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
	.post(upload.array('images', 6), (req, res) => {
		console.log(req.body, req.files);
		res.send('done');
	});

router.route('/new').get(isLoggedIn, showNewCampgroundForm);

router
	.route('/:id')
	.get(showCampground)
	.put(isLoggedIn, isAuthor, submitCampgroundUpdates)
	.delete(isLoggedIn, isAuthor, deleteCampground);

router.route('/:id/edit').get(isLoggedIn, isAuthor, showEditCampgroundForm);

module.exports = router;
