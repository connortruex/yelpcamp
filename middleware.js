const Campground = require('./models/campground');
const Review = require('./models/review');
const { validateCampgroundSchema, validateReviewSchema } = require('./schemas');
const wrapAsync = require('./utils/wrapAsync');
const ExpressError = require('./utils/ExpressError');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must be signed in!');
        res.redirect('/login');
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)){
        req.flash('error', 'you do not have permission!');
        res.redirect(`/campgrounds/${id}`);
    } else {
    next()
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)){
        req.flash('error', 'you do not have permission!');
        res.redirect(`/campgrounds/${id}`);
    } else {
    next()
    }
}

module.exports.validateCampground = function (req, res, next) {
    const { error } = validateCampgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}

module.exports.validateReview = function (req, res, next) {
    const { error } = validateReviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}