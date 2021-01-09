const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});
// in the schema itself, don't add username, and password feild rather use passport-local-mongoose plugin function

UserSchema.plugin(passportLocalMongoose);   //this adds username, password feild to our schema. IN ADDITION IT MAKES SURE THAT ALL usernames ARE UNIQUE AND ALSO PROVIDES SOME ADDITIONAL METHODS THAT WE CAN USE

module.exports = mongoose.model('User', UserSchema);