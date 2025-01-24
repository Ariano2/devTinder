const { SendEmailCommand } = require('@aws-sdk/client-ses');
const { sesClient } = require('./sesClient');
const createSendEmailCommand = (toAddress, fromAddress, subject, emailBody) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [],
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: emailBody,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [],
  });
};

const run = async (toEmailId, fromEmailId, subject, emailBody) => {
  const sendEmailCommand = createSendEmailCommand(
    toEmailId,
    fromEmailId,
    subject,
    emailBody
  );
  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === 'MessageRejected') {
      /** @type { import('@aws-sdk/client-ses').MessageRejected} */
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

module.exports = { run };
