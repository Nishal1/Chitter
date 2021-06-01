const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const users = require('../controllers/user');
const { isLoggedin, isNotLoggedin } = require('../middleware');

router
    .route('/register')
    .get(isNotLoggedin, users.renderRegister)
    .post(isNotLoggedin, catchAsync(users.register));

router
    .route('/login')
    .get(isNotLoggedin, users.renderLogin)
    .post(
        passport.authenticate('local', {
            failureFlash: true,
            failureRedirect: '/login',
        }),
        isNotLoggedin,
        users.login
    );

router.route('/logout').get(users.logout);

module.exports = router;
