// Ready for work

// Models


// Posts

// tnterest:
// text:
// date:
// comments:
// author:


const mongoose = require('mongoose');
const Schema = mongoose.Schema

const blogSchema = new Schema({
    imageUrl: String,
    interest: String,
    title: String,
    message: String,
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    comments: { type: Schema.Types.ObjectId, ref: 'Comment' },
    date: Date
})

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;