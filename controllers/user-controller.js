const {validationResult} = require("express-validator");
const uuid = require('uuid').v4;

const HttpError = require('../models/http-error');

const getUsers = (req, res, next) => {
  res.json({users: DUMMY_USERS});
};

const userSignUp = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed.', 422);
  }

  const {username, email, password} = req.body;
  const userExists = DUMMY_USERS.find(user => user.email === email);
  if (userExists) {
    throw new HttpError('Could not create user, email exists', 422);
  }

  const newUser = {
    id: uuid(),
    username,
    email,
    password,
  };
  DUMMY_USERS.push(newUser);
  res.status(201).json({user: newUser});
};

const userLogin = (req, res, next) => {
  const {email, password} = req.body;
  const identifiedUser = DUMMY_USERS.find(user => (user.email === email));
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError('Could not find ID or password is wrong.', 404);
  }
  res.status(200).json({user: identifiedUser});
};

exports.getUsers = getUsers;
exports.userSignup = userSignUp;
exports.userLogin = userLogin;
