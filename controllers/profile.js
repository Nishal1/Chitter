const Comment = require('../models/comment');
const User = require('../models/user');
const Post = require('../models/post');
const ExpressError = require('../utils/ExpressError');
const ObjectId = require("mongoose").Types.ObjectId;
const formatDate = require('../helper');

module.exports.renderProfile = async (req, res) => {

    try {
        const authorId = req.params.id;
        const user = await User.findById(authorId);
        const result = await User.aggregate([
            {
                $match: {
                    _id: ObjectId(authorId)
                }
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "_id",
                    foreignField: "author",
                    as: "posts"
                }
            }
        ]);

        const date = formatDate(req.user.createdAt, false);
        if (result.length > 0) {
            return res.render('profile', { result, date, user, formatDate });
        } else {
            res.status(404).send("User not found");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}

module.exports.follow = async (req, res) => {
    try {
        const { id } = req.params; //id of to follow
        const currUserId = req.user._id;
        console.log(id, "  ", currUserId);
        const userToFollow = await User.findById(id);
        const currUser = await User.findById(currUserId);

        if(!userToFollow || !currUser) {
            req.flash('error', 'Something went wrong');
            return res.redirect(`/profile/${id}`);
        }

        userToFollow.follower.push(currUserId);
        currUser.following.push(id);

        await userToFollow.save();
        await currUser.save();

        req.flash('success', 'Followed')
        res.redirect(`/profile/${id}`);

    } catch (err) {
        res.status(500).send("Something went wrong");
    }
}