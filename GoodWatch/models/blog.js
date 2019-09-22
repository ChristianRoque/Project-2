const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    imageUrl: String,
    interest: String,
    title: String,
    message: String,
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    date: Date
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;