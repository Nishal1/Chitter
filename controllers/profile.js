const Comment = require('../models/comment');
const User = require('../models/user');
const Post = require('../models/post');
const ExpressError = require('../utils/ExpressError');
const ObjectId = require("mongoose").Types.ObjectId;

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

        const year = req.user.createdAt.getFullYear();
        const month = req.user.createdAt.getMonth();
        const dt = req.user.createdAt.getDate();

        if (dt < 10) {
            dt = '0' + dt;
        }

        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const date = `${monthNames[month]} ${year}`;
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