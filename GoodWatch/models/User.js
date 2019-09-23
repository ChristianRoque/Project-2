const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
<<<<<<< HEAD
	username: String,
	password: String,
	email: String,
	profilePic: String,
	likes: Array,
	theme: String,
	blogURL: String,
	interest: Array,
	followers: [ { type: Schema.Types.ObjectId, ref: 'User' } ]
=======
    username: String,
    password: String,
    email: String,
    profilePic: String,
    likes: Array,
    theme: String,
    about: String,
    blogURL: String,
    interest: Array,
    posts: { type: Schema.Types.ObjectId, ref: 'Blog' },
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }]
>>>>>>> 21bab2b52b15c9fc2af9a3933fc4e597a595d135
});

const User = mongoose.model('User', userSchema);

module.exports = User;
