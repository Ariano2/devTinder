const express = require('express');
const userRouter = express.Router();
const { ConnectionRequest } = require('../models/connectionRequest');
const { userAuth } = require('../middlewares/auth');
const { User } = require('../models/user');

const USER_PUBLIC_DATA = 'about firstName lastName age gender photoUrl skills';

userRouter.get('/user/requests/received', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequestList = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: 'interested',
    }).populate({
      path: 'fromUserId',
      select: USER_PUBLIC_DATA,
    });
    res.json({
      message: 'Connection Requests Fetched Successfully',
      connectionRequestList,
    });
  } catch (err) {
    res.status(400).send('ERROR + ' + err.message);
  }
});

userRouter.get('/user/connections', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    let connections = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: 'accepted' },
        { fromUserId: loggedInUser._id, status: 'accepted' },
      ],
    });
    await Promise.all(
      connections.map(async (con) => {
        if (con.fromUserId.toString() === loggedInUser._id.toString()) {
          await con.populate({
            path: 'toUserId',
            select: USER_PUBLIC_DATA,
          });
          return;
        }
        await con.populate({
          path: 'fromUserId',
          select: USER_PUBLIC_DATA,
        });
      })
    );
    res.json({
      message: 'Connections Fetched Successfully',
      connections,
    });
  } catch (err) {
    res.status(400).send('Error : ' + err.message);
  }
});

userRouter.get('/feed', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const logInUserId = loggedInUser._id;
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    page = page < 0 ? 1 : page;
    limit = limit > 50 ? 50 : limit;
    limit = limit < 0 ? 10 : limit;
    const skip = (page - 1) * limit;
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: logInUserId }, { toUserId: logInUserId }],
    });

    // find connectionRequests where fromUserId or toUserId matches logInUserId

    const hideUsersFromFeed = new Set();
    connectionRequests.map((con) => {
      hideUsersFromFeed.add(con.toUserId.toString());
      hideUsersFromFeed.add(con.fromUserId.toString());
    });
    hideUsersFromFeed.add(logInUserId);
    const userFeed = await User.find({
      _id: { $nin: Array.from(hideUsersFromFeed) },
    })
      .skip(skip)
      .limit(limit)
      .select(USER_PUBLIC_DATA);

    // filter out connection requests and connections (accepted/rejected)

    res.send(userFeed);
  } catch (err) {
    res.status(400).send('ERROR : ' + err.message);
  }
});

module.exports = { userRouter };
