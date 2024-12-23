const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  firstName: {
    type: 'String',
    maxLength: 50,
    minLength: 3,
    required: true,
    trim: true,
  },
  lastName: { type: 'String', maxLength: 50, minLength: 3, trim: true },
  password: {
    type: 'String',
    required: true,
    maxLength: 72,
    minLength: 3,
    required: true,
    trim: true,
  },
  age: { type: 'Number', min: 18, max: 150 },
  emailId: {
    type: 'String',
    lowercase: true,
    required: true,
    maxLength: 60,
    trim: true,
    unique: true,
  },
  gender: {
    type: 'String',
    lowercase: true,
    validate(val) {
      if (!['male', 'female', 'other'].includes(val)) {
        throw new Error('Gender is Invalid');
      }
    },
  },
  photoUrl: {
    type: 'String',
    default:
      'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg',
    maxLength: 2083,
  },
  skills: {
    type: [String],
    validate(val) {
      if (val.length > 10) {
        throw new Error('Cannot have more than 10 skills');
      }
    },
  },
  about: { type: 'String', maxLength: 250 },
});

userSchema.methods.generateJWT = async function () {
  const token = await jwt.sign({ _id: this.id }, 'DEV@Tinder007', {
    expiresIn: '7d',
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const hashedPassword = this.password;
  const isLoginAllowed = await bcrypt.compare(
    passwordInputByUser,
    hashedPassword
  );
  return isLoginAllowed;
};

const User = mongoose.model('User', userSchema);
module.exports = { User };
