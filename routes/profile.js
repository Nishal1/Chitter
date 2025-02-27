const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const Post = require('../models/post');
const {
    isLoggedin,
    isNotAuthor,
    isFollowing,
    isFollowingAlready,
} = require('../middleware');
const profile = require('../controllers/profile');
const ObjectId = require('mongoose').Types.ObjectId;

router.route('/').get(isLoggedin, catchAsync(profile.renderProfile));

router
    .route('/follow')
    .post(isLoggedin, isNotAuthor, isFollowing, catchAsync(profile.follow));

router.post(
    '/unfollow',
    isLoggedin,
    isFollowingAlready,
    catchAsync(profile.unfollow),
);

router.get('/followers', isLoggedin, catchAsync(profile.renderFollowers));
router.get('/following', isLoggedin, catchAsync(profile.renderFollowing));

router.get('/explore', isLoggedin, catchAsync(profile.renderUsers));

router.post('/search', isLoggedin, catchAsync(profile.search));

module.exports = router;
