const Post = require('../models/post');

module.exports.index = (req, res) => {
    res.render('posts/index');
}