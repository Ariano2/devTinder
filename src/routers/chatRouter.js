const express = require('express');
const { userAuth } = require('../middlewares/auth');
const chatRouter = express.Router();
const { Chat } = require('../models/chat');
const { ConnectionRequest } = require('../models/connectionRequest');

chatRouter.get('/chat/:targetId', userAuth, async (req, res) => {
  const userId = req.user._id;
  const { targetId } = req.params;
  try {
    const connection = await ConnectionRequest.findOne({
      $or: [
        {
          fromUserId: userId,
          toUserId: targetId,
          status: 'accepted',
        },
        {
          fromUserId: targetId,
          toUserId: userId,
          status: 'accepted',
        },
      ],
    });
    if (!connection) {
      throw new Error('Users have no connections between them');
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
