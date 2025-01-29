const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const auth = require('../controllers/auth');


router.route('/register')
    .get(auth.renderRegisterForm)
    .post(wrapAsync(auth.createNewUser))

router.route('/login')
    .get(auth.renderLogin)
    .post(passport.authenticate('local',
        {
            failureFlash: true,
            failureRedirect: '/login',
            keepSessionInfo: true
        }
    ),
        wrapAsync(auth.login));

router.get('/logout', auth.logout)

module.exports = router;