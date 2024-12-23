const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
const userAuth = async (req, res, next) => {
  try {
    // extract token from cookies
    const { token } = req.cookies;
    if (!token) {
      throw new Error('Token is Invalid');
    }
    // extract decoded secret from the token
    const { _id } = await jwt.verify(token, 'DEV@Tinder007');
    // verify/check if user exists
    const user = await User.findById(_id);
    if (!user) {
      throw new Error('User does not Exist');
    }
    req.user = user;
    next();
    // attach the user found to the req body and next
  } catch (err) {
    res.status(400).send('ERROR : ' + err.message);
  }
};

module.exports = { userAuth };