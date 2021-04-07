const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema(
    {
        FirstName: {
            type: String,
            required: true,
        },
        LastName: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },
        location: String,
        geometry: {
            type: {
                type: String,
                enum: ['Point'],
                required: true,
            },
            coordinates: {
                type: [Number],
                required: true,
            },
        },
        bio: String,
        gender: {
            type: String,
            enum: ['Male', 'Female'],
            required: true,
        },
        following: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        follower: [
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

UserSchema.plugin(passportLocalMongoose);

UserSchema.index({ geometry: '2dsphere' });

module.exports = mongoose.model('User', UserSchema);
