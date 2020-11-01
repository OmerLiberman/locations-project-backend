const HttpError = require('../models/http-error');

const DUMMY_PLACES = [
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
  const pid = req.params.pid; // { pid : 'p1' }
  const place = DUMMY_PLACES.find(p => {
    return (p.id === pid);
  });
  if (!place) {
    return next(new HttpError('Could not find a place for provided id.', 404));
  }
  res.json({place});
};

const getPlaceByUserId = (req, res, next) => {
  const uid = req.params.uid;
  const place = DUMMY_PLACES.find(place => {
    return place.creator === uid;
  });
  if (!place) {
    return next(new HttpError('Could not find a place for provided id.', 404));
  }
  res.json({place});
};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;