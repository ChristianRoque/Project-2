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
        followers: []
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
    User.findById(req.user._id)
        .populate({ path: 'blogs', populate: { path: 'comments' } })
        .populate('followers')
        .then((user) => {
            let arr = user.blogs;
            arr.forEach(function(element) {
                let arr2 = element.comments;
                arr2.forEach(function(element) {
                    if (element.author.equals(req.user._id)) {
                        element.mine = true;
                        // now we are attaching a .mine key to all the books who have a creator equal to currently logged in user's ID
                        // and also, if currently logged in user isAdmin, were attaching it to all of them
                    }
                });
            });
            console.log(user.blogs);
            if (req.user._id) {
                res.render('users/profile', { User: user });
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

router.get('/profile/:userBlog', (req, res, next) => {
    let key = req.params.userBlog;
    User.findOne({ blogURL: key })
        .populate({ path: 'blogs', populate: { path: 'comments' } })
        .populate('followers')
        .then((user) => {
            res.render('users/profile', { User: user });
        });
});

// router.post('/follow-user/:id', (req, res, next) => {
//     let userid = req.params.id;
//     User.findByIdAndUpdate(userid, { $push: { followers: req.user } }).then((user) => {
//         res.redirect(`/profile/${user.blogURL}`, { User: user });
//     });
// });

router.post('/delete-account', (req, res, next) => {
    User.findByIdAndDelete(req.user);
});

module.exports = router;

// start routes later tomorrow