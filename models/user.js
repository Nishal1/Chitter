const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
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
    }
}, {
    timestamps: true
});

UserSchema.plugin(passportLocalMongoose);  

module.exports = mongoose.model('User', UserSchema);