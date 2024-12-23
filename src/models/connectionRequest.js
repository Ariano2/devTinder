const mongoose = require('mongoose');
const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: { type: mongoose.ObjectId, required: true, ref: 'User' },
    toUserId: { type: mongoose.ObjectId, required: true, ref: 'User' },
    status: {
      type: 'string',
      required: true,
      enum: {
        values: ['ignored', 'interested', 'accepted', 'rejected'],
        message: `{VALUE} is invalid connection status`,
      },
    },
  },
  { timestamps: true }
);

// to perform pre save checks
connectionRequestSchema.pre('save', async function (next) {
  const toUserId = this.toUserId;
  const fromUserId = this.fromUserId;
  const status = this.status;
  // A to A check
  if (fromUserId.equals(toUserId)) {
    throw new Error('Cannot Send Connection Request to Self');
  }
  // check A to B or B to A does not exist already
  const previousRequest = await ConnectionRequest.findOne({
    $or: [
      { fromUserId, toUserId },
      {
        fromUserId: toUserId,
        toUserId: fromUserId,
      },
    ],
  });
  if (previousRequest && status !== 'accepted' && status !== 'rejected') {
    throw new Error('Connection Already Exists');
  }
  next();
});

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

const ConnectionRequest = mongoose.model(
  'connectionrequests',
  connectionRequestSchema
);

module.exports = { ConnectionRequest };
