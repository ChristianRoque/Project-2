require('dotenv').config();

const bodyParser = require('body-parser');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User');
const bcrypt = require('bcryptjs');

mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true
    })
    .then((x) => {
        console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
    })
    .catch((err) => {
        console.error('Error connecting to mongo', err);
    });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(
    require('node-sass-middleware')({
        src: path.join(__dirname, 'public'),
        dest: path.join(__dirname, 'public'),
        sourceMap: true
    })
);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// default value for title local

app.use(
    session({
        secret: 'our-passport-local-strategy-app',
        resave: true,
        saveUninitialized: true
    })
);
// turning passport on
app.use(passport.initialize());
// connects the passport instance to the session above
app.use(passport.session());

app.use(flash());

// compress for memory
passport.serializeUser((user, cb) => {
    cb(null, user._id);
});
// decompress
passport.deserializeUser((id, cb) => {
    User.findById(id, (err, user) => {
        if (err) {
            return cb(err);
        }
        cb(null, user);
    });
});

passport.use(
    new LocalStrategy((username, password, next) => {
        User.findOne({ username }, (err, user) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return next(null, false, { message: 'Incorrect username' });
            }
            if (!bcrypt.compareSync(password, user.password)) {
                return next(null, false, { message: 'Incorrect password' });
            }

            return next(null, user);
        });
    })
);

// creating universal variable
app.use((req, res, next) => {
    res.locals.logged = req.user;
    res.locals.errorMessage = req.flash('error');
    next();
});

const index = require('./routes/index');
app.use('/', index);

const user = require('./routes/user');
app.use('/', user);

const blog = require('./routes/blog');
app.use('/', blog);

const comment = require('./routes/comment');
app.use('/', comment);

module.exports = app;