// Comments:

// authorofComment:
// text:
// date:
// postdetails:

const mongoose = require('mongoose');
const Schema = mongoose.Schema

const commentSchema = new Schema({

    message: String,
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    date: Date
})

const Comment = mongoose.model('Comment', blogSchema);

module.exports = Comment;