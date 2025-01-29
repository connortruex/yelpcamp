if(process.env.NOD_ENV !== "production"){
    require('dotenv').config();
}
const mongoSanitize = require('express-mongo-sanitize')
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const path = require('path');
const morgan = require('morgan');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const helmet = require('helmet');
const MongoStore = require('connect-mongo')(session)


const campgroundsRoute = require('./routes/campgrounds');
const reviewsRoute = require('./routes/reviews')
const authRoute = require('./routes/auth');

const flash = require('connect-flash');


const PORT = 8080;
const store = new MongoStore({
    url: process.env.MONGO_URL,
    secret: 'this is a very bad secret',
    touchAfter: 24 * 60 * 60
})
store.on("error", function(e) {
    console.log("session error")
})
const sessionConfig = {
    store,
    name: "session",
    secret: 'this is a very bad secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('connected to database!')
    })
    .catch((e) => {
        console.log('database connection error!');
        console.log(e);
    });

const db = mongoose.connection;

const app = express();
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session(sessionConfig));
app.use(flash());
app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize())
app.use(helmet({
    contentSecurityPolicy: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
})

app.use('/', authRoute);
app.use('/campgrounds', campgroundsRoute);
app.use('/campgrounds/:id/review', reviewsRoute);

app.get('/', (req, res) => {
    res.render('home');
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found!', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'UH OH SPEGETTI OHS!';
    res.status(statusCode).render('error', { err });
})

app.listen(PORT, () => {
    console.log(`Serving on port ${PORT}...`);
})
