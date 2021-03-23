const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const Comment = require('../models/comment');
const comments = require('../controllers/comment');
const { isLoggedin } = require('../middleware');

router.post('/', isLoggedin, catchAsync(comments.createComment));

module.exports = router;
