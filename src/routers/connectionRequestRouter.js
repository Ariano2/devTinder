const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const { ConnectionRequest } = require('../models/connectionRequest');
const { User } = require('../models/user');
const { connection } = require('mongoose');
const sendEmail = require('../utils/sesSendEmail');
requestRouter.post(
  '/request/send/:status/:userId',
  userAuth,
  async (req, res) => {
    try {
      const toUserId = req.params.userId;
      const status = req.params.status;
      const loggedInUser = req.user;
      const fromUserId = loggedInUser._id;
      const toUser = await User.findById(toUserId);
      const validStatus = ['ignored', 'interested'];
      const isStatusValid = validStatus.includes(status);
      if (!isStatusValid) {
        throw new Error(`${status} is Invalid Connection Request Status`);
      }
      if (!toUser) {
        throw new Error('Invalid Connection Request');
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      await connectionRequest.save();
      // now here we will send an EMAIL
      const subject = 'Pending Friend Request!';
      const emailBody =
        toUser.firstName +
        ' you received Friend Request from ' +
        loggedInUser.firstName +
        '. Login at dev2inder to accept/reject the request. Please do not respond to this email.';

      await sendEmail.run(
        'arianothrowaway@gmail.com',
        'team@dev2inder.store',
        subject,
        emailBody
      );
      res.json({
        message: 'Connection Request Sent successfully',
        connectionRequest,
      });
    } catch (err) {
      res.status(400).send('Error : ' + err.message);
    }
  }
);

requestRouter.post(
  '/request/review/:status/:requestId',
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const toUserId = loggedInUser._id;
      const { status, requestId } = req.params;
      const allowedStatus = ['accepted', 'rejected'];
      if (!allowedStatus.includes(status)) {
        throw new Error(`${status} is invalid status`);
      }
      // check allowed status
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: toUserId,
        status: 'interested',
      });
      if (!connectionRequest) {
        throw new Error('Invalid Connection Request');
      }
      // check if document with requestId exists
      // check if status of existing document is interested else throw error
      // check if request is sent to a valid user who is logged in
      connectionRequest.status = status;
      await connectionRequest.save();
      res.json({
        message: `Connection Request is ${status}`,
        connectionRequest,
      });
      // append status and save to DB
    } catch (err) {
      res.status(400).send('ERROR : ' + err.message);
    }
  }
);

module.exports = { requestRouter };
