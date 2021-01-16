const ExpressError = require('./utils/ExpressError');
const Post = require('./models/post');
const Comment = require('./models/comment');


module.exports.isLoggedin = (req, res, next) => {
    //console.log(req.user);
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    if(!post.author.equals(req.user._id)) {
        req.flash('error', 'Sorry, you do not have permission to modify the post');
        return res.redirect(`/posts/${ id }`);
    }
    next();
}