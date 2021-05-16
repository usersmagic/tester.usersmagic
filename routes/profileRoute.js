const express = require('express');

const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');
const isComplete = require('../middleware/isComplete');
const isConfirmed = require('../middleware/isConfirmed');
const isLocationComplete = require('../middleware/isLocationComplete');

const indexGetController = require('../controllers/profile/index/get');

const updatePostController = require('../controllers/profile/update/post');

router.get(
  '/',
    isLoggedIn,
    isComplete,
    isConfirmed,
    indexGetController
);

router.post(
  '/update',
    isLoggedIn,
    isComplete,
    isConfirmed,
    updatePostController
);

module.exports = router;
