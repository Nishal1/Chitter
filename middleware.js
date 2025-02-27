const ExpressError = require('./utils/ExpressError');
const { postSchema, commentSchema } = require('./schemas');
const Post = require('./models/post');
const Comment = require('./models/comment');
const User = require('./models/user');

module.exports.isLoggedin = (req, res, next) => {
    //console.log(req.user);
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
};

module.exports.isNotLoggedin = (req, res, next) => {
    //console.log(req.user);
    if (req.isAuthenticated()) {
        req.flash('success', 'Logged in');
        return res.redirect('/posts');
    }
    next();
};

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post.author.equals(req.user._id)) {
        req.flash(
            'error',
            'Sorry, you do not have permission to modify the post',
        );
        return res.redirect(`/posts/${id}`);
    }
    next();
};

module.exports.isNotAuthor = async (req, res, next) => {
    const { id } = req.params;
    const signedInUser = await User.findById(req.user._id);
    if (signedInUser.equals(id)) {
        req.flash('error', 'Sorry, you do not have permission to do that');
        return res.redirect(`/profile/${id}`);
    }
    next();
};

module.exports.isFollowing = async (req, res, next) => {
    const { id } = req.params;
    const signedInUser = await User.findById(req.user._id);
    for (let obj of signedInUser.following) {
        if (obj.equals(id)) {
            req.flash('error', 'aldready following this user');
            return res.redirect(`/profile/${id}`);
        }
    }
    next();
};

module.exports.isFollowingAlready = async (req, res, next) => {
    const { id } = req.params;
    const signedInUser = await User.findById(req.user._id);
    let flag = false;
    for (let obj of signedInUser.following) {
        if (obj.equals(id)) {
            flag = true;
        }
    }
    if (flag) {
        return next();
    }
    req.flash('error', 'Need to follow inorder to unfollow');
    res.redirect(`/profile/${id}`);
};

module.exports.hasLikedAldready = async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user._id;
    const post = await Post.findById(id);
    let flag = false;
    for (let obj of post.likes) {
        if (obj.equals(userId)) {
            flag = true;
        }
    }
    if (flag) {
        req.flash('error', 'Aldready liked this post');
        return res.redirect(`/posts/${id}`);
    }
    next();
};

module.exports.validatePost = (req, res, next) => {
    const result = postSchema.validate(req.body);
    if (result.error) {
        const msg = result.error.details.map((el) => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.validateComment = (req, res, next) => {
    const result = commentSchema.validate(req.body);
    if (result.error) {
        const msg = result.error.details.map((el) => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.isCommentAuthor = async (req, res, next) => {
    const { id, commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/posts/${id}`);
    }
    next();
};
