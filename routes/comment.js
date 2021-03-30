const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const Comment = require('../models/comment');
const comments = require('../controllers/comment');
const {
    isLoggedin,
    isCommentAuthor,
    validateComment,
} = require('../middleware');

router.post(
    '/',
    validateComment,
    isLoggedin,
    catchAsync(comments.createComment),
);

router.delete(
    '/:commentId',
    isLoggedin,
    isCommentAuthor,
    catchAsync(comments.deleteComment),
);

module.exports = router;
