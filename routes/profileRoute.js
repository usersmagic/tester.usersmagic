const express = require('express');

const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');
const isComplete = require('../middleware/isComplete');
const isConfirmed = require('../middleware/isConfirmed');

const indexGetController = require('../controllers/profile/index/get');

const discordPostController = require('../controllers/profile/discord/post');
const updatePostController = require('../controllers/profile/update/post');

router.get(
  '/',
    isLoggedIn,
    isComplete,
    isConfirmed,
    indexGetController
);

router.post(
  '/discord',
    isLoggedIn,
    isComplete,
    isConfirmed,
    discordPostController
);
router.post(
  '/update',
    isLoggedIn,
    isComplete,
    isConfirmed,
    updatePostController
);

module.exports = router;
