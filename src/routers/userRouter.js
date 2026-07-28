const express = require('express');
const userRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const { User } = require('../models/user');
const { Follow } = require('../models/follow');

const USER_PUBLIC_DATA = 'username firstName lastName photoUrl skills about';

userRouter.get('/user/discover', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    page = page < 1 ? 1 : page;
    limit = limit > 50 ? 50 : limit;
    limit = limit < 1 ? 10 : limit;
    const skip = (page - 1) * limit;

    const following = await Follow.find({ followerId: loggedInUser._id }).select('followingId');
    const excludeIds = following.map((f) => f.followingId);
    excludeIds.push(loggedInUser._id);

    const users = await User.find({ _id: { $nin: excludeIds } })
      .skip(skip)
      .limit(limit)
      .select(USER_PUBLIC_DATA);

    res.json({ message: 'Users Fetched Successfully', users });
  } catch (err) {
    res.status(400).send('Error : ' + err.message);
  }
});

userRouter.get('/user/:username', userAuth, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      USER_PUBLIC_DATA
    );
    if (!user) {
      throw new Error('User not Found');
    }
    res.json({ message: 'User Fetched Successfully', user });
  } catch (err) {
    res.status(400).send('Error : ' + err.message);
  }
});

module.exports = { userRouter };
