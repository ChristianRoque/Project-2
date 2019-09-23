const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const passport = require('passport');
const nodemailer = require('nodemailer');
const templates = require('../templates/template');

router.get('/blog', (req, res, next) => {
	res.render('blogs/new');
});

module.exports = router;
