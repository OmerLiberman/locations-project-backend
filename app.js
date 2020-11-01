const express = require('express');
const bodyParser = require('body-parser');

const PlacesRoutes = require('./routes/places-routes');
const UsersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use('/api/places', PlacesRoutes); // => /api/places/
app.use('/api/users', UsersRoutes); // => /api/places/

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