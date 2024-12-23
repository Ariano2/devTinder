const validator = require('validator');
const validateSignUp = (data) => {
  updateAllowedFields = ['firstName', 'lastName', 'email', 'password'];
  isUpdateAllowed = true;
  isUpdateAllowed = Object.keys(data).every((key) =>
    updateAllowedFields.includes(key)
  );
  const { firstName, lastName, email, password } = data;
  if (firstName)
    if (
      firstName.length < 3 ||
      firstName.length > 50 ||
      !validator.isAscii(firstName)
    )
      throw new Error('First Name is Invalid');
  if (lastName)
    if (
      lastName.length < 3 ||
      lastName.length > 50 ||
      !validator.isAscii(lastName)
    )
      throw new Error('Last Name is Invalid');
  if (password)
    if (
      password.length < 3 ||
      password.length > 72 ||
      !validator.isAscii(password)
    )
      throw new Error('Password is Invalid');
  if (email)
    if (email.length > 60 || !validator.isEmail(email))
      throw new Error('Email is Invalid');
  return true;
};
const validateProfileUpdate = (data) => {
  updateAllowedFields = [
    'firstName',
    'lastName',
    'age',
    'gender',
    'photoUrl',
    'about',
    'skills',
  ];
  isUpdateAllowed = true;
  isUpdateAllowed = Object.keys(data).every((field) =>
    updateAllowedFields.includes(field)
  );
  if (isUpdateAllowed === false) {
    return false;
  } else {
    // parameter based checks
    if (data?.firstName) {
      if (data?.firstName.length < 3 || data?.firstName.length > 50)
        throw new Error('First Name is Invalid');
    }
    if (data?.lastName) {
      if (data?.lastName.length < 3 || data?.lastName.length > 50)
        throw new Error('Last Name is Invalid');
    }
    if (data?.age) {
      if (
        !validator.isNumeric(data?.age + '') ||
        data?.age < 18 ||
        data?.age > 150
      )
        throw new Error('Age is Invalid');
    }
    if (data?.gender)
      if (!['male', 'female', 'other'].includes(data?.gender))
        throw new Error('Gender is Invalid');
    if (data?.photoUrl) {
      if (!validator.isURL(data?.photoUrl, { validate_length: true }))
        throw new Error('Photo URL is Invalid');
    }
    if (data?.about) {
      if (data?.about.length > 250 || !validator.isAscii(data?.about))
        throw new Error('About is Invalid');
    }
    if (data?.skills) {
      if (data?.skills.length > 10) throw new Error('Skills are Invalid');
      data?.skills.map((skill) => {
        if (skill.length > 100 || !validator.isAscii(skill))
          throw new Error('Skills are invalid');
      });
    }
  }
  return true;
};

module.exports = { validateProfileUpdate, validateSignUp };
