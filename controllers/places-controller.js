const uuid = require('uuid').v4;
const {validationResult} = require('express-validator');

const HttpError = require('../models/http-error');
const coordinatesGetter = require('../util/location');
const Place = require('../models/place');

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

const getPlacesByUserId = (req, res, next) => {
  const uid = req.params.uid;



  const places = DUMMY_PLACES.filter(place => {
    return place.creator === uid;
  });
  if (!places || places.length === 0) {
    return next(new HttpError('Could not find a place for provided id.', 404));
  }
  res.json({place: places});
};

const createPlace = async (req, res, next) => {
  console.log('Log: ', req.body);
  const errors = validationResult(req);
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
  try {
    await createdPlace.save();
  } catch (err) {
    let error = new HttpError('Creation failed, try again.', 500);
    return next(error);
  }
  res.status(201).json({place: createdPlace});
};

const updatePlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed.', 422);
  }

  const {title, description} = req.body;
  const pid = req.params.pid;

  const updatedPlace = {...DUMMY_PLACES.find(p => (p.id === pid))};
  const pIndex = DUMMY_PLACES.findIndex(p => (p.id === pid));
  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[pIndex] = updatedPlace;
  res.status(200).json({place: updatedPlace});
};

const deletePlace = (req, res, next) => {
  const pid = req.params.pid;
  if (!DUMMY_PLACES.find(p => (p.id === pid))) {
    throw new HttpError('Could not find a place with this id.', 404);
  }
  DUMMY_PLACES = DUMMY_PLACES.filter(p => (p.id !== pid));
  res.status(200).json({message: 'Deleted place.'});
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;