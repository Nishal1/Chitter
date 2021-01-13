const Post = require('../models/post');
const formatDate = require('../helper');

module.exports.index = async (req, res) => {
    const posts = await Post.find().populate('author');
    res.render('posts/index', { posts, formatDate });
}

module.exports.renderNewForm =  (req, res) => {
    res.render('posts/new');
}

module.exports.createPost = async (req, res) => {
    const post = new Post(req.body.post);
    post.author = req.user._id;
    await post.save();
    req.flash('success', 'Post successful');
    res.redirect(`/posts`);
}

module.exports.showPosts = async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id).populate({
        path: 'comments',
        populate: {
            path: 'author'
        }
    }).populate('author');

    if(!post) {
        req.flash('error', 'Sorry, could not find matching post');
        return res.redirect('/posts');
    }

    res.render('posts/show', { post });
}

module.exports.renderEditForm = async(req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    if(!post) {
        req.flash('error', 'Cannot find that post');
        return res.redirect('/posts')
    }
    res.render('posts/edit', { post });
}

module.exports.updatePost = async (req, res) => {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body.post);
    await post.save();

    req.flash('success', 'Successfuly updated post');
    res.redirect(`/posts/${post._id}`);
}

module.exports.deletePost = async(req, res) => {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    req.flash('success', 'Succesfully deleted a Post');
    res.redirect('/posts');
}