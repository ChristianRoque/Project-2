const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	username: String,
	password: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;

/ Users

// username:
// notrouble

// email:
// notrouble

// password:
// notrouble

// profilePicture:
// maybetrouble

// theme:
// notrouble

// blogURL:
// notrouble

// interest: []
// simpletrouble

// posts: {}
// followers:
// HARDtrouble
