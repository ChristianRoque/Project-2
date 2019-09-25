const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Blog = require('../models/blog');
const passport = require('passport');
const nodemailer = require('nodemailer');
const templates = require('../templates/template');
const uploadCloud = require('../config/cloudinary.js');

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% USER AUTH %%%%%%%%%%%%%%%%%%%%%%%%%%

/* GET home page */
router.get('/', (req, res, next) => {
    res.render('index');
});

router.post('/signup', uploadCloud.single('profilePic'), (req, res, next) => {
    let { email, subject, message } = req.body;

    const imgPath = req.file.url;
    const imgName = req.file.originalname;

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
        coverPic: coverPic,
        blogs: []
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
    User.findById(req.user._id).populate({ path: 'blogs', populate: { path: 'comments' } }).then((user) => {
        console.log(user.blogs);
        if (req.user) {
            res.render('users/profile', { theUser: user });
        } else {
            res.redirect('/login');
        }
    });
});

router.get('/settings', (req, res, next) => {
    res.render('users/edit-account');
});

router.post('/settings', (req, res, next) => {
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
        coverPic: coverPic
    }).then((well) => {
        res.redirect('/profile');
    });
});

router.post('/delete-account', (req, res, next) => {
    User.findByIdAndDelete(req.user);
});

module.exports = router;

// start routes later tomorrow