const express = require('express');
const {check} = require('express-validator');

const PlacesController = require('../controllers/places-controller');

const router = express.Router();

router.get('/:pid', PlacesController.getPlaceById);

router.get('/user/:uid', PlacesController.getPlacesByUserId);

router.post(
    '/',  // the url
    // what to validate:
    [
        check('title').not().isEmpty(),
        check('description').isLength({min: 5, max: 20}),
        check('address').not().isEmpty(),
    ],
    // middleware function
    PlacesController.createPlace
);

router.patch(
    '/:pid',
    [
      check('title').not().isEmpty(),
    ],
    PlacesController.updatePlace);

router.delete('/:pid', PlacesController.deletePlace);


module.exports = router;