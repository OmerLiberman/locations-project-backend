const express = require('express');
const bodyParser = require('body-parser');

const placesRoutes = require('./routes/places-routes');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));

app.use('/api/places', placesRoutes); // => /api/places/ (dds the routes from places-routes.js)



app.listen(5000);