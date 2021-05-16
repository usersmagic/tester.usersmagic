const express = require('express');

const router = express.Router();

const isComplete = require('../middleware/isComplete');
const isConfirmed = require('../middleware/isConfirmed');
const isLoggedIn = require('../middleware/isLoggedIn');

const campaignIndexGetController = require('../controllers/test/campaign/index/get');
const campaignSubmitGetController = require('../controllers/test/campaign/submit/get');
const customIndexGetController = require('../controllers/test/custom/index/get');
const customSubmitGetController = require('../controllers/test/custom/submit/get');
const filterIndexGetController = require('../controllers/test/filter/index/get');
const filterSubmitGetController = require('../controllers/test/filter/submit/get');

const campaignSavePostController = require('../controllers/test/campaign/save/post');
const customSavePostController = require('../controllers/test/custom/save/post');
const filterSavePostController = require('../controllers/test/filter/save/post');

router.get(
  '/campaign',
    isLoggedIn,
    isComplete,
    isConfirmed,
    campaignIndexGetController
);
router.get(
  '/custom',
    customIndexGetController
);
router.get(
  '/filter',
    isLoggedIn,
    isComplete,
    isConfirmed,
    filterIndexGetController
);
router.get(
  '/campaign/submit',
    isLoggedIn,
    isComplete,
    isConfirmed,
    campaignSubmitGetController
);
router.get(
  '/custom/submit',
    customSubmitGetController
);
router.get(
  '/filter/submit',
    isLoggedIn,
    isComplete,
    isConfirmed,
    filterSubmitGetController
);

router.post(
  '/campaign/save',
    isLoggedIn,
    isComplete,
    isConfirmed,
    campaignSavePostController
);
router.post(
  '/custom/save',
    customSavePostController
);
router.post(
  '/filter/save',
    isLoggedIn,
    isComplete,
    isConfirmed,
    filterSavePostController
);

module.exports = router;
