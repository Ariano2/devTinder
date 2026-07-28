const DUPLICATE_FIELD_MESSAGES = {
  emailId: 'An account with this email already exists',
  username: 'This username is already taken',
};

// Mongo/Mongoose throw low-level driver errors (E11000 dup key, ValidationError
// wrapper text) that are meaningless and slightly alarming to an end user.
// Translate the known shapes into plain sentences; anything else falls back
// to the original message (already clean, since our own validators throw
// plain Error objects with a human-readable .message).
const toFriendlyMessage = (err) => {
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || err.keyValue || {})[0];
    return DUPLICATE_FIELD_MESSAGES[field] || 'That value is already in use';
  }
  if (err.name === 'ValidationError') {
    const firstError = Object.values(err.errors)[0];
    return firstError?.message || 'Invalid details provided';
  }
  return err.message;
};

module.exports = { toFriendlyMessage };
