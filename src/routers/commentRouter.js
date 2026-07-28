const express = require('express');
const commentRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const { Comment } = require('../models/comment');
const { Post } = require('../models/post');
const { resolveMentions } = require('../utils/mentions');

const USER_PUBLIC_DATA = 'username firstName lastName photoUrl';

commentRouter.post('/post/:postId/comment', userAuth, async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    if (!content) {
      throw new Error('Comment content is required');
    }
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error('Post not Found');
    }
    const mentions = await resolveMentions(content);
    const comment = new Comment({
      postId,
      authorId: req.user._id,
      content,
      mentions,
    });
    await comment.save();
    res.json({ message: 'Comment Added Successfully', comment });
  } catch (err) {
    res.status(400).send('Error : ' + err.message);
  }
});

commentRouter.get('/post/:postId/comment', userAuth, async (req, res) => {
  try {
    const { postId } = req.params;
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 20;
    page = page < 1 ? 1 : page;
    limit = limit > 50 ? 50 : limit;
    limit = limit < 1 ? 20 : limit;
    const skip = (page - 1) * limit;

    const comments = await Comment.find({ postId })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .populate({ path: 'authorId', select: USER_PUBLIC_DATA });

    res.json({ message: 'Comments Fetched Successfully', comments });
  } catch (err) {
    res.status(400).send('Error : ' + err.message);
  }
});

commentRouter.delete('/comment/:commentId', userAuth, async (req, res) => {
  try {
    const comment = await Comment.findOne({
      _id: req.params.commentId,
      authorId: req.user._id,
    });
    if (!comment) {
      throw new Error('Comment not Found');
    }
    await comment.deleteOne();
    res.json({ message: 'Comment Deleted Successfully' });
  } catch (err) {
    res.status(400).send('Error : ' + err.message);
  }
});

module.exports = { commentRouter };
