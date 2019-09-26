const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    profilePic: String,
    likes: Array,
    theme: String,
    blogURL: String,
    blogs: [{ type: Schema.Types.ObjectId, ref: 'Blog' }],
    interest: Array,
    coverPic: String,
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;