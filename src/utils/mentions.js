const { User } = require('../models/user');

const extractMentions = (text) => {
  const matches = text.match(/@([a-zA-Z0-9_]{3,30})/g) || [];
  const usernames = matches.map((m) => m.slice(1).toLowerCase());
  return [...new Set(usernames)];
};

const resolveMentions = async (text) => {
  const usernames = extractMentions(text);
  if (usernames.length === 0) return [];
  const users = await User.find({ username: { $in: usernames } }).select('_id');
  return users.map((u) => u._id);
};

module.exports = { extractMentions, resolveMentions };
