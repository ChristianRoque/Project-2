const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const passport = require('passport');
const Blog = require('../models/blog')

// router.get('/blog', (req, res, next) => {
//     res.render('blogs/new');
// });
router.get('/blogs', (req, res, next) => {
    Blog.find()
        .then((allBlogs) => {
            console.log(allBlogs)
            res.render('blogs/index', { blogs: allBlogs })
        })
        .catch((err) => {
            next(err);
        })
})

router.get('/blogs/details/:theid', (req, res, next) => {
    let id = req.params.theid

    Blog.findById(id).populate('author')
        .then((blogObject) => {
            console.log("AUTHOR", blogObject)
            console.log(blogObject.author)
            res.render('blogs/details', { theBlog: blogObject })
        })
        .catch((err) => {
            next(err);
        })
})

router.get('/blogs/new', (req, res, next) => {
    Author.find()
        .then((result) => {
            res.render('blogs/new', { allTheauthor: result });
        })
        .catch((err) => {
            next(err)
        })
})

router.post('/blogs/creation', (req, res, next) => {

    let imageUrl = req.body.theimageUrl;
    let interest = req.body.theInterest
    let title = req.body.theTitle;
    let message = req.body.theMessage;
    let author = req.body.theAuthor;
    let date = req.body.theDate

    Blog.create({
            imgageUrl: imageUrl,
            interest: interest,
            title: title,
            message: message,
            author: author,
            date: date
        })
        .then(() => {
            res.redirect('/')
        })
        .catch((err) => {
            next(err);
        })
})

router.post('/blogs/delete/:id', (req, res, next) => {
    let id = req.params.id;

    Blog.findByIdAndRemove(id)
        .then((result) => {
            res.redirect('/blogs')
        })
        .catch((err) => {
            next(err)
        })
})

router.get('/blogs/editblog/:id', (req, res, next) => {
    let id = req.params.id;

    Blog.findById(id)
        .then((theBlog) => {
            author.find()
                .then((authorResult) => {
                    data = {
                        blog: theBlog,
                        author: authorResult
                    };
                    res.render('blogs/edit', data);
                })
                .catch((err) => {
                    next(err);
                });
        })
        .catch((err) => {
            next(err)
        })
})

router.post('/blogs/update/:id', (req, res, next) => {

    let id = req.params.id;

    Blog.findByIdAndUpdate(id, {

            imageUrl: req.body.theimageUrl,
            interest: req.body.theInterest,
            title: req.body.theTitle,
            message: req.body.theMessage,
            author: req.body.theAuthor,
            date: req.body.theDate

        })
        .then(() => {
            res.redirect('/blogs/details/' + id)
        })
        .catch((err) => {
            next(err);
        })

})

module.exports = router;