const {validationResult} = require('express-validator');
const uuid = require('uuid').v4;

const HttpError = require('../models/http-error');
const User = require('../models/user');

/**
 * GET request for all users.
 */
const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password') ;
  } catch (err) {
    const error = new HttpError('Fetching users failed.', 500);
    return next(error);
  }
  res.json({users: users.map(user => user.toObject({getters: true}))});
};

/**
 * Post request for signing up users.
 */
const userSignUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new HttpError('Invalid inputs passed.', 422);
    return next(err);
  }

  const {name, email, password} = req.body;
  let userExists;
  try {
    userExists = await User.findOne({email: email});
  } catch (err) {
    const error = new HttpError('Could not create user', 500);
    return next(error);
  }

  if (userExists) {
    const error = new HttpError('User already exists.', 422);
    return next(error);
  }

  const newUser = new User({
    name,
    email,
    image: 'route',
    password,
    places: [],
  });

  try {
    await newUser.save();
  } catch (err) {
    const error = new HttpError('Signing up failed.', 500);
    return next(error);
  }

  res.status(201).json({user: newUser.toObject({getters: true})});
};

/**
 * Post request for user login.
 */
const userLogin = async (req, res, next) => {
  const {email, password} = req.body;
  let userExists;
  try {
    userExists = await User.findOne({email: email});
  } catch (err) {
    const error = new HttpError('Could not create user', 500);
    return next(error);
  }

  if (!userExists || userExists.password !== password) {
    const error = new HttpError('Invalid credentials.', 401);
    return next(error);
  }

  res.status(200).json({message: 'Logged in.'});
};

exports.getUsers = getUsers;
exports.userSignup = userSignUp;
exports.userLogin = userLogin;
