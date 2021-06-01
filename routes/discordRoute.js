const express = require('express');
const router = express.Router();

const isComplete = require('../middleware/isComplete');
const isConfirmed = require('../middleware/isConfirmed');
const isLoggedIn = require('../middleware/isLoggedIn');

const indexGetController = require('../controllers/discord/get');
const indexPostController = require('../controllers/discord/post');

router.get(
  '/',
    isLoggedIn,
    isComplete,
    isConfirmed,
    indexGetController
);

router.post(
  '/',
    isLoggedIn,
    isComplete,
    isConfirmed,
    indexPostController
)

module.exports = router;
