const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Comment = require('../models/Comment');
const passport = require('passport');
const Blog = require('../models/blog');
const uploadCloud = require('../config/cloudinary.js');

// router.get('/blog', (req, res, next) => {
//     res.render('blogs/new');
// });
router.get('/blogs', (req, res, next) => {
    Blog.find()
        .then((allBlogs) => {
            console.log(allBlogs);
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
        .populate('comments')
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
    console.log(req.file)


    const imgPath = req.file.url;
    let imageURL = req.body.imageURL;
    let interest = req.body.interest;
    let title = req.body.title;
    let message = req.body.message;
    let author = req.user.username;

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
            User.findByIdAndUpdate(req.user._id, { $push: { blogs: blog._id } }).then((user) => {
                console.log(user);
            });
            res.redirect('/blogs');
        })
        .catch((err) => {
            next(err);
        });
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

    Blog.findById(id)
        .then((theBlog) => {
            res.render('blogs/edit', { blog: theBlog });
        })
        .catch((err) => {
            next(err);
        });
});

router.post('/blogs/editblogs/:id', (req, res, next) => {
    let id = req.params.id;
    let imageURL = req.body.imageURL;
    let interest = req.body.interest;
    let title = req.body.title;
    let message = req.body.message;
    let author = req.user.username;

    Blog.findByIdAndUpdate(id, {
            imageURL: imageURL,
            interest: interest,
            title: title,
            message: message,
            author: author,
            date: new Date()
        })
        .then(() => {
            res.redirect('/blogs');
        })
        .catch((err) => {
            next(err);
        });
});

module.exports = router;