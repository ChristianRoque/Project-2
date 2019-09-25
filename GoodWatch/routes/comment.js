const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Blog = require('../models/blog');
const passport = require('passport');
const Comment = require('../models/Comment');

router.get('/comment', (req, res, next) => {
	Comment.find().then((results) => {
		res.render('blogs/comments', { results: results });
	});
});

router.post('/comment-create/:id', (req, res, next) => {
	let message = req.body.message;
	let id = req.params.id;
	console.log(id);
	Comment.create({
		message: message,
		date: Date(Date.now()),
		author: req.user._id,
		editable: false
	}).then((comment) => {
		Blog.findByIdAndUpdate(id, { $push: { comments: comment._id } }).then((blog) => {});
		res.redirect('/profile');
	});
});

router.post('/delete-comment/:id', (req, res, next) => {
	let id = req.params.id;
	Comment.findByIdAndDelete(id).then((well) => {
		res.redirect('/comment');
	});
});

router.post('/edit-comment/:id', (req, res, next) => {
	let id = req.params.id;
	Comment.findByIdAndUpdate(id, { editable: true }).then((well) => {
		res.redirect('/comment');
	});
});

router.post('/edit/:id', (req, res, next) => {
	let message = req.body.messageUpdated;
	let id = req.params.id;
	console.log(message);
	Comment.findByIdAndUpdate(id, { message: message, editable: false }).then((well) => {
		res.redirect('/comment');
	});
});

module.exports = router;
