const Comment = require('../models/comment');
const User = require('../models/user');
const Post = require('../models/post');
const ExpressError = require('../utils/ExpressError');
const ObjectId = require('mongoose').Types.ObjectId;
const { formatDate, isFollowing , majorityFollowing } = require('../helper');

module.exports.renderProfile = async (req, res) => {
    try {
        const authorId = req.params.id;
        const user = await User.findById(authorId);
        const result = await User.aggregate([
            {
                $match: {
                    _id: ObjectId(authorId),
                },
            },
            {
                $lookup: {
                    from: 'posts',
                    localField: '_id',
                    foreignField: 'author',
                    as: 'posts',
                },
            },
        ]);

        const date = formatDate(req.user.createdAt, false);
        const displayFollow = isFollowing(req.user, authorId);

        if (result.length > 0) {
            return res.render('profile', {
                result,
                date,
                user,
                displayFollow,
                formatDate,
            });
        } else {
            res.status(404).send('User not found');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Something went wrong');
    }
};

module.exports.follow = async (req, res) => {
    try {
        const { id } = req.params; //id of to follow
        const currUserId = req.user._id;
        const userToFollow = await User.findById(id);
        const currUser = await User.findById(currUserId);

        if (!userToFollow || !currUser) {
            req.flash('error', 'Something went wrong');
            return res.redirect(`/profile/${id}`);
        }

        userToFollow.follower.push(currUserId);
        currUser.following.push(id);

        await userToFollow.save();
        await currUser.save();

        req.flash('success', 'Followed');
        res.redirect(`/profile/${id}`);
    } catch (err) {
        res.status(500).send('Something went wrong');
    }
};

module.exports.renderFollowers = async (req, res) => {
    const { id } = req.params;
    const users = await User.findById(id).populate('follower');

    res.render('followers', { users, isFollowing });
};

module.exports.renderFollowing = async (req, res) => {
    const { id } = req.params;
    const users = await User.findById(id).populate('following');

    res.render('following', { users, isFollowing });
};

module.exports.unfollow = async (req, res) => {
    try {
        const { id } = req.params; //id of to unfollow
        const currUserId = req.user._id;
        const userToUnfollow = await User.findById(id);
        const currUser = await User.findById(currUserId);
        if (!userToUnfollow || !currUser) {
            req.flash('error', 'Something went wrong');
            return res.redirect(`/profile/${id}`);
        }

        for (let i = 0; i < userToUnfollow.follower.length; i++) {
            if (userToUnfollow.follower[i].equals(currUserId)) {
                userToUnfollow.follower.splice(i, 1);
                break;
            }
        }

        for (let i = 0; i < currUser.following.length; i++) {
            if (currUser.following[i].equals(id)) {
                currUser.following.splice(i, 1);
                break;
            }
        }

        await userToUnfollow.save();
        await currUser.save();

        req.flash('success', 'unfollowed');
        res.redirect(`/profile/${id}`);
    } catch (err) {
        res.status(500).send('Something went wrong');
    }
};

module.exports.renderUsers = async (req, res) => {
    // const users = await User.find();
    const currUser = req.user;
    let people = [];

    for(let i = 0; i < currUser.following.length - 1; i++){
        const p = await User.findById(currUser.following[i]);
        const q = await User.findById(currUser.following[i+1]);
        let val = majorityFollowing(p.following, q.following);
        if(!val.equals(currUser._id) && !currUser.following.includes(val))
            people.push(val);
    }
    // console.log(people);
    people = [...new Set(people)];
    // console.log(people);
    const users = [];
    for(let x of people){
        users.push(await User.findById(x));
    }
    // console.log(users);
    if(users.length < 1){    //=>people = [] 
        for(let i = 0; i < currUser.follower.length - 1; i++){
            const p = await User.findById(currUser.follower[i]);
            const q = await User.findById(currUser.follower[i+1]);
            let val = majorityFollowing(p.follower, q.follower);
            if(!val.equals(currUser._id) && currUser.follower.includes(val))
                people.push(val);
        }

        for(let x of people){
            users.push(await User.findById(x));
        }
        return res.render('users', { users });
    }
    res.render('users', { users });
};
