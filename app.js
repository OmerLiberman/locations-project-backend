const express = require('express');
const bodyParser = require('body-parser');

const placesRoutes = require('./routes/places-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use('/api/places', placesRoutes); // => /api/places/ (dds the routes from places-routes.js)

app.use((req, res, next) => {
  const err = new HttpError('Could not find route', 404);
  throw err;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500).
      json({message: error.message || 'An unknown error occurred.'});
});

app.listen(5000);