const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const passport = require('passport');

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% USER AUTH %%%%%%%%%%%%%%%%%%%%%%%%%%

// //////////////////////////////// SIGN UP
router.post('/signup', (req, res, next) => {
	const username = req.body.username;
	const password = req.body.password;
	const email = req.body.email;
	const profilePic = req.body.profilePic;
	const theme = req.body.theme;
	const blogurl = req.body.blogURL;

	console.log(username);
	console.log(password);

	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(password, salt);

	User.create({
		username: username,
		password: hash,
		email: email,
		profilePic: profilePic,
		theme: theme,
		blogURL: blogurl
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
		res.render('users/profile');
	} else {
		res.redirect('/login');
	}
});

module.exports = router;
