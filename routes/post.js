const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const posts = require('../controllers/post');

router.route('/')
    .get(posts.index);


module.exports = router;