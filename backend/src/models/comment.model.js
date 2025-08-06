import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    postId: {
        type: mongoose.Types.ObjectId,
        ref: "Post",
        required: true
    },
    likes: {
        type: [mongoose.Types.ObjectId],
        ref: "User",
        default: []
    }

}, {timestamps: true})

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;