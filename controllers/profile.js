const Comment = require('../models/comment');
const User = require('../models/user');
const Post = require('../models/post');
const ExpressError = require('../utils/ExpressError');
const ObjectId = require("mongoose").Types.ObjectId;
const formatDate = require('../helper');

module.exports.renderProfile = async (req, res) => {

    try {
        const authorId = req.user._id;
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
            return res.render('profile', { result, date });
        } else {
            res.status(404).send("User not found");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}