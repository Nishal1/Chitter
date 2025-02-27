const mongoose = require('mongoose');
const Comment = require('./comment');
const Schema = mongoose.Schema;

const PostSchema = new Schema(
    {
        body: String,
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Comment',
            },
        ],
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        timestamps: true,
    },
);

PostSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Comment.deleteMany({
            _id: {
                $in: doc.reviews,
            },
        });
    }
});

module.exports = mongoose.model('Post', PostSchema);
