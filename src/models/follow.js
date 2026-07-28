const mongoose = require('mongoose');

const followSchema = new mongoose.Schema(
  {
    followerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    followingId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  },
  { timestamps: true }
);

followSchema.pre('save', function (next) {
  if (this.followerId.equals(this.followingId)) {
    throw new Error('Cannot Follow Yourself');
  }
  next();
});

followSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

const Follow = mongoose.model('Follow', followSchema);

module.exports = { Follow };
