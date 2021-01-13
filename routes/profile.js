const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Post = require('../models/post');
const { isLoggedin } = require('../middleware');
const profile = require('../controllers/profile');
const ObjectId = require("mongoose").Types.ObjectId;

router.route('/')
    .get(isLoggedin, catchAsync(profile.renderProfile));


module.exports = router;