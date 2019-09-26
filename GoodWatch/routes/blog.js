const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Comment = require('../models/Comment');
const passport = require('passport');
const Blog = require('../models/blog');
const uploadCloud = require('../config/cloudinary.js');

router.get('/blogs', (req, res, next) => {
	Blog.find()
		.then((allBlogs) => {
			res.render('blogs/index', { blogs: allBlogs });
		})
		.catch((err) => {
			next(err);
		});
});

router.get('/blogs/:id', (req, res, next) => {
	let id = req.params.id;

	Blog.findById(id)
		.populate('author')
		.populate({ path: 'comments', populate: { path: 'author' } })
		.then((blogObject) => {
			res.render('blogs/details', { theBlog: blogObject });
		})
		.catch((err) => {
			next(err);
		});
});

router.get('/new-blog', (req, res, next) => {
	res.render('blogs/new');
});

router.post('/new-blog', uploadCloud.single('blogphoto'), (req, res, next) => {
	const imgPath = req.file.url;
	let imageURL = req.body.imageURL;
	let interest = req.body.interest;
	let title = req.body.title;
	let message = req.body.message;
	let author = req.user.username;

	if (req.user) {
		Blog.create({
			imageURL: imgPath,
			interest: interest,
			title: title,
			message: message,
			author: req.user._id,
			comments: [],
			date: new Date()
		})
			.then((blog) => {
				User.findByIdAndUpdate(req.user._id, { $push: { blogs: blog._id } }).then((user) => {});
				res.redirect('/blogs');
			})
			.catch((err) => {
				next(err);
			});
	} else {
		res.redirect('/login');
	}
});

router.post('/blogs/delete/:id', (req, res, next) => {
	let id = req.params.id;

	Blog.findByIdAndRemove(id)
		.then((result) => {
			res.redirect('/blogs');
		})
		.catch((err) => {
			next(err);
		});
});

router.get('/blogs/editblog/:id', (req, res, next) => {
	let id = req.params.id;

	if (req.user) {
		Blog.findById(id)
			.then((blog) => {
				console.log(blog._id);
				if (req.user._id.equals(blog.author)) {
					res.render('blogs/edit', { blog: blog });
				} else {
					res.redirect(`/blogs/${blog._id}`);
				}
			})
			.catch((err) => {
				next(err);
			});
	} else {
		res.redirect('/login');
	}
});

router.post('/blogs/editblogs/:id', (req, res, next) => {
	let id = req.params.id;
	let imageURL = req.body.imageURL;
	let interest = req.body.interest;
	let title = req.body.title;
	let message = req.body.message;

	if (user.req) {
		Blog.findById(id).then((blog) => {
			if (req.user._id.equals(blog.author)) {
				Blog.findByIdAndUpdate(id, {
					imageURL: imageURL,
					interest: interest,
					title: title,
					message: message,
					date: new Date()
				})
					.then(() => {
						res.redirect('/blogs');
					})
					.catch((err) => {
						next(err);
					});
			} else {
				res.redirect('/login');
			}
		});
	} else {
		res.redirect('/login');
	}
});

router.get('/myblogs', (req, res, next) => {
	if (req.user) {
		User.findById(req.user._id).populate('blogs').then((user) => {
			if (req.user._id.equals(user._id)) {
				res.render('blogs/myblogs', { User: user });
			}
		});
	} else {
		res.redirect('/login');
	}
});

router.get('/myblog/:id', (req, res, next) => {
	let id = req.params.id;
	if (req.user) {
		Blog.findById(id)
			.populate('author')
			.populate({ path: 'comments', populate: { path: 'author' } })
			.then((blog) => {
				if (req.user._id.equals(blog.author._id)) {
					res.render('blogs/mydetails', { theBlog: blog });
				} else {
					res.redirect(`/blogs/${blog._id}`);
				}
			});
	} else {
		res.redirect('/login');
	}
});

module.exports = router;
