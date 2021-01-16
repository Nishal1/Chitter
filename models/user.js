const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    FirstName: {
        type: String,
        required: true
    } ,
    LastName: {
        type: String,
        required: true
    } ,
    
    email: {
        type: String,
        required: true,
        unique: true
    } ,
    following: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
     }] ,
    follower: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
     }] 
}, {
    timestamps: true
});

UserSchema.plugin(passportLocalMongoose);  

module.exports = mongoose.model('User', UserSchema);