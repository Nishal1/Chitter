const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const posts = require('../controllers/post');
const Post = require('../models/post');
const { isLoggedin } = require('../middleware');

router.route('/')
    .get(isLoggedin, posts.index);


module.exports = router;