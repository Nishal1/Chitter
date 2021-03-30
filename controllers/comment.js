const Comment = require('../models/comment');
const Post = require('../models/post');
const ExpressError = require('../utils/ExpressError');

module.exports.createComment = async (req, res) => {
    const post = await Post.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    comment.author = req.user._id;
    post.comments.push(comment);
    await post.save();
    await comment.save();
    req.flash('success', 'Created a new comment');
    res.redirect(`/posts/${req.params.id}`);
};

module.exports.deleteComment = async (req, res) => {
    const { id, commentId } = req.params;
    await Post.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    req.flash('success', 'Successfully deleted a comment');
    res.redirect(`/posts/${id}`);
};
