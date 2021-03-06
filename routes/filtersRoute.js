const express = require('express');
const router = express.Router();

const isComplete = require('../middleware/isComplete');
const isConfirmed = require('../middleware/isConfirmed');
const isLocationComplete = require('../middleware/isLocationComplete');
const isLoggedIn = require('../middleware/isLoggedIn');

const indexGetController = require('../controllers/filters/index/get');
const joinGetController = require('../controllers/filters/join/get');

router.get(
  '/',
    isLoggedIn,
    isComplete,
    isConfirmed,
    indexGetController
);
router.get(
  '/join',
    isLoggedIn,
    isComplete,
    isConfirmed,
    // isLocationComplete,
    joinGetController
);

module.exports = router;
