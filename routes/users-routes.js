const express = require('express');

const UsersController = require('../controllers/user-controller');

const router = express.Router();

router.get('/', UsersController.getUsers);

router.post('/signup', UsersController.userSignup);

router.post('/login', UsersController.userLogin);

module.exports = router;