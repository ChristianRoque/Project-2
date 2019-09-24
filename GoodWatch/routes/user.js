const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const passport = require('passport');
const nodemailer = require('nodemailer');
const templates = require('../templates/template');

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% USER AUTH %%%%%%%%%%%%%%%%%%%%%%%%%%

/* GET home page */
router.get('/', (req, res, next) => {
    res.render('index');
});

router.post('/signup', (req, res, next) => {
    let { email, subject, message } = req.body;

    const username = req.body.username;
    const password = req.body.password;
    const Email = req.body.email;
    const profilePic = req.body.profilePic;
    const theme = req.body.theme;
    const blogurl = req.body.blogURL;

    console.log(username);
    console.log(password);

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
        profilePic: profilePic,
        theme: theme,
        blogURL: blogurl,
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
    User.findById(req.user._id).populate('blogs').then((user) => {
        console.log(user);
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

    User.findByIdAndUpdate(req.user._id, {
        username: username,
        email: email,
        profilePic: profilePic,
        theme: theme,
        blogURL: blogurl
    }).then((well) => {
        res.redirect('/profile');
    });
});

module.exports = router;

// start routes later tomorrow