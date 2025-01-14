const express = require('express');
const authRouter = express.Router();
const { validateSignUp } = require('../utils/apiValidator');
const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const validator = require('validator');

authRouter.post('/signup', async (req, res) => {
  try {
    const data = req.body;
    // request validation
    if (!validateSignUp(data)) {
      throw new Error('Signup Failed');
    }
    const { firstName, lastName, password, emailId } = data;
    // password hashing
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      password: hashedPassword,
      emailId,
    });
    await user.save();
    const token = await user.generateJWT();
    // cookies expire in 7 days (1day = 86400000 ms)
    res.cookie('token', token, { maxAge: 86400000 * 7 });
    res.json({ message: 'User Created Successfully', data: user });
  } catch (err) {
    res.status(400).send('Error User could not be Signed Up: ' + err.message);
  }
});

authRouter.post('/login', async (req, res) => {
  try {
    const { password, emailId } = req.body;
    if (validator.isEmail(emailId)) {
      const user = await User.findOne({ emailId: emailId });
      if (!user) {
        throw new Error('Invalid Credentials');
      }
      const isLoginAllowed = await user.validatePassword(password);
      if (!isLoginAllowed) {
        throw new Error('Invalid Credentials');
      }
      const token = await user.generateJWT();
      // cookies expire in 7 days (1day = 86400000 ms)
      res.cookie('token', token, { maxAge: 86400000 * 7 });
      res.send({ message: 'Logged In Successfully', data: user });
    } else {
      throw new Error('Invalid Credentials');
    }
  } catch (err) {
    res.status(400).send('Login Error : ' + err.message);
  }
});

authRouter.post('/logout', async (req, res) => {
  res.cookie('token', null, { expires: new Date(Date.now()) });
  res.send('Logged Out Successfully');
});

module.exports = { authRouter };
