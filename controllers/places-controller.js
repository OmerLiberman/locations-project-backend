const uuid = require('uuid').v4;
const {validationResult} = require('express-validator');

const HttpError = require('../models/http-error');

let DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State',
    description: 'Sky scraper',
    location: {
      lat: 40.748,
      lng: -73.987,
    },
    address: 'Something in NY',
    creator: 'u1',
  },
];

const getPlaceById = (req, res, next) => {
  const pid = req.params.pid;
  const place = DUMMY_PLACES.find(p => {
    return (p.id === pid);
  });
  if (!place) {
    return next(new HttpError('Could not find a place for provided id.', 404));
  }
  res.json({place});
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

const createPlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed.', 422);
  }
  const {title, description, coordinates, address, creator} = req.body;
  const createdPlace = {
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };
  DUMMY_PLACES.push(createdPlace);

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
  DUMMY_PLACES = DUMMY_PLACES.filter(p => (p.id !== pid));
  res.status(200).json({message: 'Deleted place.'});
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;