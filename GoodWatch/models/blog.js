const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
<<<<<<< HEAD
	imageUrl: String,
	interest: String,
	title: String,
	message: String,
	author: { type: Schema.Types.ObjectId, ref: 'User' },
	date: Date
=======
    imageUrl: String,
    interest: String,
    title: String,
    message: String,
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    date: Date
>>>>>>> 21bab2b52b15c9fc2af9a3933fc4e597a595d135
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;