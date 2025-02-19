
const User = require('../models/user');


module.exports.renderRegisterForm = (req, res) => {
    res.render('auth/register');
}

module.exports.createNewUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', `welcome to yelpcamp ${username}`);
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('auth/login');
}

module.exports.login = async (req, res) => {
    req.flash('success', 'welcome');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
    });
    req.flash('success', 'goodbye!');
    res.redirect('/campgrounds');
}