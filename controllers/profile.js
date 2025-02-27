const Comment = require('../models/comment');
const User = require('../models/user');
const Post = require('../models/post');
const ExpressError = require('../utils/ExpressError');
const ObjectId = require('mongoose').Types.ObjectId;
const { formatDate, isFollowing, majorityFollowing } = require('../helper');

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

        const date = formatDate(user.createdAt, false);
        const displayFollow = isFollowing(req.user, authorId);

        if (result.length > 0) {
            return res.render('profile', {
                result,
                date,
                user,
                displayFollow,
                formatDate,
                page: 'profile',
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

    res.render('followers', { users, isFollowing, page: 'followers' });
};

module.exports.renderFollowing = async (req, res) => {
    const { id } = req.params;
    const users = await User.findById(id).populate('following');

    res.render('following', { users, isFollowing, page: 'following' });
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
    const currUser = req.user;
    let similarPlaceUsers = await User.find({
        location: req.user.location,
        _id: { $ne: [req.user._id] },
    });
    let users = [];
    users = similarPlaceUsers;
    let peeps = [];
    for(let i = 0 ; i < currUser.follower; i++) {
        if(!currUser.following[i].includes(currUser.follower[i], 0)) {
            peeps.push(currUser.follower[i]);
        }
    }
    users = [...new Set(peeps)];
    // let people = [];

    // for (let i = 0; i < currUser.following.length - 1; i++) {
    //     const p = await User.findById(currUser.following[i]);
    //     const q = await User.findById(currUser.following[i + 1]);
    //     let val = majorityFollowing(p.following, q.following);
    //     if (!val.equals(currUser._id) && !currUser.following.includes(val))
    //         people.push(val);
    // }
    // // console.log(people);
    // people = [...new Set(people)];
    // // console.log(people);

    
    // users = [...new Set(similarPlaceUsers)];
    // for (let x of people) {
    //     users.push(await User.findById(x));
    // }
    // // console.log(users);
    // if (users.length < 1) {
    //     //=>people = []
    //     for (let i = 0; i < currUser.follower.length; i++) {
    //         const p = await User.findById(currUser.follower[i]);
    //         const q = await User.findById(currUser.follower[i + 1]);
    //         let val = majorityFollowing(p.follower, q.follower);
    //         if (!currUser.following.includes(currUser.follower[i]))
    //             people.push(currUser.follower[i]);
    //     }

    //     people = [...new Set(people)];

    //     for (let x of people) {
    //         users.push(await User.findById(x));
    //     }
    //     return res.render('users', { users });
    // }

    // for (let i = 0; i < users.length; i++) {
    //     for (let j = 0; j < currUser.following.length; j++) {
    //         if (currUser.following[j].equals(users[i])) {
    //             users.splice(i, 1);
    //             i--;
    //         }
    //     }
    // }
    // let jsonObject = users.map(JSON.stringify);

    // let uniqueSet = new Set(jsonObject);
    // let uniqueArray = Array.from(uniqueSet).map(JSON.parse);
    // users = uniqueArray;
    // console.log(users);
    res.render('users', { users, page: 'users' });
};

module.exports.search = async (req, res) => {
    let { key } = req.body;
    let usersList = await User.find({
       // username: { $regex: '.*' + key + '.*', $options: 'i' },
    });
    let users = [];
    key = key.toLowerCase();
    for (let j=0; j < usersList.length; j++) {
        let p = usersList[j].username.toLowerCase();
        if (p.match(key)) users.push(usersList[j]);
    }
    res.render('users', { users, page: 'users' });
};
