const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Blog = require('../models/blog');
const passport = require('passport');
const Comment = require('../models/Comment');
const axios = require('axios');

router.post('/comment-create/:id', (req, res, next) => {
	let id = req.params.id;
	let message = req.body.message;
	let url = req.body.blogSite;

	if (req.user == undefined) {
		res.redirect('/login');
	} else {
		Comment.create({
			message: message,
			date: Date(Date.now()),
			author: req.user._id,
			editable: false
		}).then((comment) => {
			Blog.findByIdAndUpdate(id, { $push: { comments: comment._id } }).then((blog) => {
				User.findById(url).then((user) => {
					res.redirect(`/profile/${user.blogURL}`);
				});
			});
		});
	}
});

router.post('/delete-comment/:id', (req, res, next) => {
	let id = req.params.id;
	Comment.findByIdAndDelete(id).then((well) => {
		res.redirect('/profile');
	});
});

router.post('/edit-comment/:id', (req, res, next) => {
	let id = req.params.id;
	Comment.findByIdAndUpdate(id, { editable: true }).then((well) => {
		res.redirect('/profile');
	});
});

router.post('/edit/:id', (req, res, next) => {
	let message = req.body.messageUpdated;
	let id = req.params.id;
	console.log(message);
	Comment.findByIdAndUpdate(id, { message: message, editable: false }).then((well) => {
		res.redirect('/profile');
	});
});

module.exports = router;
