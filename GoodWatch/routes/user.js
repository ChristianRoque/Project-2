const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Blog = require('../models/blog');
const Comment = require('../models/Comment');
const passport = require('passport');
const nodemailer = require('nodemailer');
const templates = require('../templates/template');
const uploadCloud = require('../config/cloudinary.js');

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% USER AUTH %%%%%%%%%%%%%%%%%%%%%%%%%%

/* GET home page */
router.get('/', (req, res, next) => {
	res.render('index');
});

router.post('/signup', uploadCloud.array('photo', 2), (req, res, next) => {
	let { email, subject, message } = req.body;
	const imgPath = req.files[0].url;
	const coverPath = req.files[1].url;

	const about = req.body.about;
	const username = req.body.username;
	const password = req.body.password;
	const Email = req.body.email;
	const profilePic = req.body.profilePic;
	const theme = req.body.theme;
	const blogurl = req.body.blogURL;
	const coverPic = req.body.coverPic;

	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(password, salt);

	let transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: 'views.blogpost@gmail.com',
			pass: 'Ms134life'
		}
	});
	User.create({
		username: username,
		password: hash,
		emaill: email,
		profilePic: imgPath,
		theme: theme,
		blogURL: blogurl,
		coverPic: coverPath,
		blogs: [],
		followers: [],
		about: about
	});
	transporter
		.sendMail({
			from: '"VERIFY YOUR ACCOUNT" <views.blogpost@gmail.com>',
			to: email,
			subject: subject,
			html: templates.templateExample(username)
		})
		.then(() => {
			res.redirect('/login');
		})
		.catch((err) => {
			next(err);
		});
});

router.get('/signup', (req, res, next) => {
	res.render('users/signup');
});

////////////////////////////////// LOGIN
router.get('/login', (req, res, next) => {
	res.render('users/login');
});

router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash: true,
		passReqToCallback: true
	})
);

///////////////////////////////////////// LOGOUT

router.get('/logout', (req, res, next) => {
	req.logOut();
	res.redirect('/');
});

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% USER PAGES %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

router.get('/profile', (req, res, next) => {
	if (req.user) {
		User.findById(req.user._id)
			.populate({ path: 'blogs', populate: { path: 'comments', populate: { path: 'author' } } })
			.populate('followers')
			.then((user) => {
				let arr = user.blogs;
				arr.forEach(function(blogs) {
					let arr2 = blogs.comments;
					arr2.forEach(function(comment) {
						if (comment.author.equals(req.user._id)) {
							comment.mine = true;
							// now we are attaching a .mine key to all the books who have a creator equal to currently logged in user's ID
							// and also, if currently logged in user isAdmin, were attaching it to all of them
						}
					});
				});
				if (req.user._id) {
					console.log(user.blogs.length);
					res.render('users/profile', { User: user });
				} else {
					res.redirect('/login');
				}
			});
	} else {
		res.redirect('/login');
	}
});

router.get('/settings', (req, res, next) => {
	if (req.user) {
		res.render('users/edit-account', { User: req.user });
	} else {
		res.redirect('/login');
	}
});

router.post('/settings', (req, res, next) => {
	const about = req.body.about;
	const username = req.body.username;
	const password = req.body.password;
	const email = req.body.email;
	const profilePic = req.body.profilePic;
	const theme = req.body.theme;
	const blogurl = req.body.blogURL;
	const coverPic = req.body.coverPic;

	User.findByIdAndUpdate(req.user._id, {
		username: username,
		email: email,
		profilePic: profilePic,
		theme: theme,
		blogURL: blogurl,
		coverPic: coverPic,
		about: about
	}).then((well) => {
		res.redirect('/profile');
	});
});

router.get('/profile/:userBlog', (req, res, next) => {
	let key = req.params.userBlog;
	User.findOne({ blogURL: key })
		.populate({ path: 'blogs', populate: { path: 'comments', populate: { path: 'author' } } })
		.populate('followers')
		.then((user) => {
			let following = false;
			if (req.user) {
				let arr = user.followers;
				arr.forEach((follower) => {
					if (follower._id.equals(req.user._id)) {
						following = true;
					}
				});
			}
			let arr = user.blogs;
			arr.forEach(function(blogs) {
				let arr2 = blogs.comments;
				arr2.forEach(function(comment) {
					if (comment.author.equals(req.user._id)) {
						comment.mine = true;
						// now we are attaching a .mine key to all the books who have a creator equal to currently logged in user's ID
						// and also, if currently logged in user isAdmin, were attaching it to all of them
					}
				});
			});
			res.render('users/profile', { User: user, Following: following });
		});
});

router.post('/follow-user/:id', (req, res, next) => {
	let userid = req.params.id;

	if (req.user) {
		User.findById(userid).then((user) => {
			user.followers.forEach((follower) => {
				if ((follower._id = req.user._id)) {
					res.redirect(`/profile/${user.blogURL}`);
				}
			});
			User.findByIdAndUpdate(userid, { $push: { followers: req.user } }).then((user) => {
				res.redirect(`/profile/${user.blogURL}`);
			});
		});
		// User.findByIdAndUpdate(userid, { $push: { followers: req.user } }).then((user) => {
		// 	res.redirect(`/profile/${user.blogURL}`);
		// });
		// } else {
		// 	res.redirect('/login');
	}
});

router.post('/delete-account', (req, res, next) => {
	User.findByIdAndDelete(req.user);
});

module.exports = router;
