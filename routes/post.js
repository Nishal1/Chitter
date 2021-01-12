const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const posts = require('../controllers/post');
const Post = require('../models/post');
const { isLoggedin } = require('../middleware');

router.route('/')
    .get(isLoggedin, catchAsync(posts.index))
    .post(isLoggedin, catchAsync(posts.createPost));

router.get('/new', isLoggedin, posts.renderNewForm);

router.route('/:id')
    .get(isLoggedin, catchAsync(posts.showPosts))
    .put(isLoggedin, catchAsync(posts.updatePost))
    .delete(isLoggedin, catchAsync(posts.deletePost));

router.get('/:id/edit', isLoggedin, catchAsync(posts.renderEditForm));

module.exports = router;