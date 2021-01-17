const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const Post = require('../models/post');
const { isLoggedin, isNotAuthor, isFollowing, isFollowingAlready } = require('../middleware');
const profile = require('../controllers/profile');
const ObjectId = require("mongoose").Types.ObjectId;

router.route('/')
    .get(isLoggedin, catchAsync(profile.renderProfile));

router.route('/follow')
    .post(isLoggedin, isNotAuthor, isFollowing, catchAsync(profile.follow));

router.post('/unfollow', isLoggedin, isFollowingAlready, catchAsync(profile.unfollow));

router.post('/followers', isLoggedin, catchAsync(profile.renderFollowers));
router.post('/following', isLoggedin, catchAsync(profile.renderFollowing));


module.exports = router;