const socket = require('socket.io');
const { Chat } = require('../models/chat');
const { ConnectionRequest } = require('../models/connectionRequest');

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: 'http://localhost:5173',
    },
  });

  io.on('connection', (socket) => {
    socket.on('joinChat', ({ userId, targetId }) => {
      // join a room with a roomId created from userId and targetID
      const roomId = [userId, targetId].sort().join('_');
      socket.join(roomId);
    });
    socket.on(
      'sendMessage',
      async ({ userId, targetId, firstName, message, timeStamp }) => {
        const roomId = [userId, targetId].sort().join('_');
        const text = message;
        try {
          // check if both users are connections
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
          });
          if (!chat) {
            // create a chat
            chat = await Chat.create({
              participants: [userId, targetId],
              messages: [],
            });
          }
          chat.messages.push({ text, senderId: userId });
          await chat.save();
          io.to(roomId).emit('receivedMessage', {
            senderId: { firstName },
            text: message,
            createdAt: timeStamp,
          });
        } catch (err) {
          console.log(err);
        }
      }
    );
    socket.on('disconnect', () => {});
  });
};

module.exports = initializeSocket;
