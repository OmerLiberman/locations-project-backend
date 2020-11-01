const express = require('express');

const router = express.Router();

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

router.get('/:pid', (req, res, next) => {
  const pid = req.params.pid; // { pid : 'p1' }
  const place = DUMMY_PLACES.find(p => {
    return (p.id === pid);
  });
  res.json({place});
});

module.exports = router;