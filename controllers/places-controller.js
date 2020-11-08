const mongoose = require('mongoose');
const {validationResult} = require('express-validator');

const HttpError = require('../models/http-error');
const coordinatesGetter = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');

/**
 * GET request to get place by id.
 */
const getPlaceById = async (req, res, next) => {
  const pid = req.params.pid;
  let place = null;
  try {
    place = await Place.findById(pid);
  } catch (err) {
    const error = new HttpError('Something went wrong.', 500);
    return next(error);
  }

  if (!place) {
    const error = new HttpError('Could not find a place.', 404);
    return next(error);
  }

  res.json({place: place.toObject({getters: true})});
};

/**
 * GET request for all places related to some id.
 */
const getPlacesByUserId = async (req, res, next) => {
  const uid = req.params.uid;
  let places;
  try {
    places = await Place.find({creator: uid});
  } catch (err) {
    const error = new HttpError('Fetching places failed.', 500);
    return next(error);
  }
  if (!places || places.length === 0) {
    return next(new HttpError('Could not find a place for provided id.', 404));
  }
  res.json({place: places.map(p => p.toObject({getters: true}))});
};

/**
 * POST request to create place.
 */
const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed.', 422);
  }
  const {title, description, address, creator} = req.body;
  const DUMMY_IMG = 'https://www.touristisrael.com/wp-content/uploads/WesternWall-courtesy1-e1449917399814-300x200.jpg';
  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinatesGetter.getCoordsForAddress(address),
    image: DUMMY_IMG,
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError('Creating place failed', 500);
    return next(error);
  }
  if (!user) {
    const error = new HttpError('Creator does not exist.', 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    await sess.startTransaction();
    await createdPlace.save({session: sess});
    user.places.push(createdPlace);
    await user.save({session: sess});
    await sess.commitTransaction();
  } catch (err) {
    let error = new HttpError('Creation failed, try again.', 500);
    return next(error);
  }
  res.status(201).json({place: createdPlace});
};

/**
 * PATCH request to update place.
 */
const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed.', 422);
  }
  const {title, description} = req.body;
  const pid = req.params.pid;

  let place;
  try {
    place = await Place.findById(pid);
  } catch (err) {
    const error = new HttpError('Something went wrong', 500);
    return next(error);
  }
  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError('Something went wrong', 500);
    return next(error);
  }

  res.status(200).json({place: place.toObject({getters: true})});
};

/**
 * DELETE request to delete place.
 */
const deletePlace = async (req, res, next) => {
  const pid = req.params.pid;

  let place;
  try {
    place = await Place.findById(pid).populate('creator');
  } catch (err) {
    const error = new HttpError('Something went wrong.', 500);
    return next(error);
  }

  if (!place) {
    const error = new HttpError('Could not find a place id', 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({session: sess});
    place.creator.places.pull(place);
    await place.creator.save({session: sess});
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError('Something went wrong.', 500);
    return next(error);
  }

  res.status(200).json({message: 'Place has been deleted.'});
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;