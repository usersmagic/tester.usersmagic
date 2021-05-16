const express = require('express');
const router = express.Router();

const isComplete = require('../middleware/isComplete');
const isConfirmed = require('../middleware/isConfirmed');
const isLoggedIn = require('../middleware/isLoggedIn');

const indexGetController = require('../controllers/wallet/index/get');
const paymentGetController = require('../controllers/wallet/payment/get');

const numberPostController = require('../controllers/wallet/number/post');

router.get(
  '/',
    isLoggedIn,
    isComplete,
    isConfirmed,
    indexGetController
);
router.get(
  '/payment',
    isLoggedIn,
    isComplete,
    isConfirmed,
    paymentGetController
);

router.post(
  '/number',
    isLoggedIn,
    isComplete,
    isConfirmed,
    numberPostController
);

module.exports = router;
