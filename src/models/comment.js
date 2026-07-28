const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Post' },
    authorId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    content: { type: String, required: true, maxLength: 100, trim: true },
    mentions: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] },
  },
  { timestamps: true }
);

commentSchema.index({ postId: 1, createdAt: 1 });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = { Comment };
