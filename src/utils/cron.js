const cron = require('node-cron');
const { subDays } = require('date-fns');
const { ConnectionRequest } = require('../models/connectionRequest');
const sendEmail = require('./sesSendEmail');
// execute at 8 AM each day
cron.schedule('0 8 * * *', async () => {
  // send emails to those who have pending requests in last day
  try {
    let yesterdayEnd = new Date();
    yesterdayEnd = yesterdayEnd.setHours(24, 0, 0, 0);
    const yesterdayStart = subDays(yesterdayEnd, 1);
    const yesterdayPendingConnections = await ConnectionRequest.find({
      status: 'interested',
      createdAt: { $gte: yesterdayStart, $lt: yesterdayEnd },
    }).populate('fromUserId toUserId');
    const toEmailList = [
      ...new Set(
        yesterdayPendingConnections.map((req) => req.toUserId.emailId)
      ),
    ];
    for (email of toEmailList) {
      try {
        sendEmail.run(
          'arianothrowaway@gmail.com',
          'team@dev2inder.store',
          'Pending Friend Requests in Last 24 Hours!',
          'You have pending request(s) in the last 24 hours. Please Login at dev2inder.store to accept/reject the pending requests'
        );
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    console.log(err);
  }
});
