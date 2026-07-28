const express = require('express');
const { userAuth } = require('../middlewares/auth');
const chatRouter = express.Router();
const { Chat } = require('../models/chat');
const { Follow } = require('../models/follow');

chatRouter.get('/chat/:targetId', userAuth, async (req, res) => {
  const userId = req.user._id;
  const { targetId } = req.params;
  try {
    const [followsTarget, followedByTarget] = await Promise.all([
      Follow.findOne({ followerId: userId, followingId: targetId }),
      Follow.findOne({ followerId: targetId, followingId: userId }),
    ]);
    if (!followsTarget || !followedByTarget) {
      throw new Error('Users must follow each other to chat');
    }
    let chat = await Chat.findOne({
      participants: { $all: [userId, targetId] },
    }).populate({
      path: 'messages.senderId',
      select: 'firstName',
    });
    if (!chat) {
      // create a chat
      chat = await Chat.create({
        participants: [userId, targetId],
        messages: [],
      });
    }
    res.json(chat);
  } catch (err) {
    res.status(400).send('ERROR' + err.message);
  }
});

module.exports = { chatRouter };
