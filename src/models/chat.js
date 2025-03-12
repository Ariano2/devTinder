const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const chatSchema = new mongoose.Schema({
  participants: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    required: true,
  },
  messages: { type: [messageSchema], required: true, default: {} },
});

const Chat = mongoose.model('Chat', chatSchema);
module.exports = { Chat };
