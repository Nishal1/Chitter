const Post = require('../models/post');
const User = require('../models/user');
const {
    formatDate,
    isFollowing,
    hasAldreadyLiked,
    yourFeed,
} = require('../helper');
let flag = 1; //0 <= flag <= 1

module.exports.index = async (req, res) => {
    //const posts = await Post.find().populate('author');
    flag = 1;
    const following = req.user.following;
    const posts = [];
    const pos = [];
    for (let f of following) {
        pos.push(await Post.find({ author: f._id }).populate('author'));
    }

    for (let i = 0; i < pos.length; i++) {
        for (let j = 0; j < pos[i].length; j++) {
            posts.push(pos[i][j]);
        }
    }
    // console.log(posts);
    // //console.log(pos);
    res.render('posts/index', {
        posts,
        formatDate,
        hasAldreadyLiked,
        page: 'index',
    });
};

module.exports.forYouIndex = async (req, res) => {
    flag = 1;
    const following = req.user.following;
    const posts = [];
    const pos = [];
    for (let f of following) {
        pos.push(await Post.find({ author: f._id }).populate('author'));
    }

    for (let i = 0; i < pos.length; i++) {
        for (let j = 0; j < pos[i].length; j++) {
            posts.push(pos[i][j]);
        }
    }
    // console.log(posts);
    // //console.log(pos);
    res.render('posts/index', {
        posts,
        formatDate,
        hasAldreadyLiked,
        page: 'index',
    });
};

module.exports.decreasingIndex = async (req, res) => {
    let posts = [];
    if (flag === 0) {
        let p = await Post.find().populate('author');
        posts = p;
    }
    if (flag === 1) {
        const following = req.user.following;
        const pos = [];
        for (let f of following) {
            pos.push(await Post.find({ author: f._id }).populate('author'));
        }

        for (let i = 0; i < pos.length; i++) {
            for (let j = 0; j < pos[i].length; j++) {
                posts.push(pos[i][j]);
            }
        }
    }

    posts.sort((a, b) =>
        a.createdAt > b.createdAt ? 1 : b.createdAt > a.createdAt ? -1 : 0,
    );
    res.render('posts/index', {
        posts,
        formatDate,
        hasAldreadyLiked,
        page: 'index',
    });
};

module.exports.increasingIndex = async (req, res) => {
    let posts = [];
    if (flag === 0) {
        let p = await Post.find().populate('author');
        posts = p;
    }
    if (flag === 1) {
        const following = req.user.following;
        const pos = [];
        for (let f of following) {
            pos.push(await Post.find({ author: f._id }).populate('author'));
        }

        for (let i = 0; i < pos.length; i++) {
            for (let j = 0; j < pos[i].length; j++) {
                posts.push(pos[i][j]);
            }
        }
    }
    posts.sort((a, b) =>
        a.createdAt < b.createdAt ? 1 : b.createdAt < a.createdAt ? -1 : 0,
    );
    res.render('posts/index', {
        posts,
        formatDate,
        hasAldreadyLiked,
        page: 'index',
    });
};

module.exports.renderNewForm = (req, res) => {
    res.render('posts/new', { page: 'new' });
};

module.exports.createPost = async (req, res) => {
    const post = new Post(req.body.post);
    post.author = req.user._id;
    await post.save();
    req.flash('success', 'Post successful');
    res.redirect(`/posts`);
};

module.exports.showPosts = async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id)
        .populate({
            path: 'comments',
            populate: {
                path: 'author',
            },
        })
        .populate('author');

    if (!post) {
        req.flash('error', 'Sorry, could not find matching post');
        return res.redirect('/posts');
    }

    res.render('posts/show', {
        post,
        formatDate,
        hasAldreadyLiked,
        page: 'show',
    });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
        req.flash('error', 'Cannot find that post');
        return res.redirect('/posts');
    }
    res.render('posts/edit', { post, page: 'edit' });
};

module.exports.updatePost = async (req, res) => {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body.post);
    await post.save();

    req.flash('success', 'Successfuly updated post');
    res.redirect(`/posts/${post._id}`);
};

module.exports.deletePost = async (req, res) => {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    req.flash('success', 'Succesfully deleted a Post');
    res.redirect('/posts');
};

module.exports.likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);

        if (!post) {
            req.flash('error', 'Something went wrong');
            return res.redirect('/posts');
        }
        if (hasAldreadyLiked(post, req.user._id)) {
            //remove like
            for (let i = 0; i < post.likes.length; i++) {
                if (post.likes[i].equals(req.user._id)) {
                    post.likes.splice(i, 1);
                    break;
                }
            }
            req.flash('success', 'UnLiked');
        } else {
            post.likes.push(req.user._id);
            req.flash('success', 'Liked');
        }
        await post.save();
        res.redirect(`/posts/${id}`);
    } catch (e) {
        res.status(500).send('Something went wrong');
    }
};

module.exports.showLikes = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id).populate('likes');
        const user = await User.findById(req.user._id);

        if (!post) {
            req.flash('error', 'Something went wrong');
            return res.redirect('/posts');
        }

        res.render('posts/like', { post, isFollowing, page: 'like' });
    } catch (e) {
        res.status(500).send('Something went wrong');
    }
};
