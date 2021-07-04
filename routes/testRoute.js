const express = require('express');

const router = express.Router();

const isComplete = require('../middleware/isComplete');
const isConfirmed = require('../middleware/isConfirmed');
const isLoggedIn = require('../middleware/isLoggedIn');

const campaignIndexGetController = require('../controllers/test/campaign/index/get');
const campaignSubmitGetController = require('../controllers/test/campaign/submit/get');
const customDataGetController = require('../controllers/test/custom/data/get');
const customFilterIndexGetController = require('../controllers/test/custom/filter/index/get');
const customFilterValidateGetController = require('../controllers/test/custom/filter/validate/get');
const customIndexGetController = require('../controllers/test/custom/index/get');
const customSubmitGetController = require('../controllers/test/custom/submit/get');
const customSubmitionGetController = require('../controllers/test/custom/submition/get');
const filterIndexGetController = require('../controllers/test/filter/index/get');
const filterSubmitGetController = require('../controllers/test/filter/submit/get');

const campaignSavePostController = require('../controllers/test/campaign/save/post');
const customSavePostController = require('../controllers/test/custom/save/post');
const customFilterSavePostController = require('../controllers/test/custom/filter/save/post');
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
  '/custom/data',
    isLoggedIn,
    customDataGetController
);
router.get(
  '/custom/filter',
    isLoggedIn,
    customFilterIndexGetController
);
router.get(
  '/custom/filter/validate',
    isLoggedIn,
    customFilterValidateGetController
);
router.get(
  '/custom/submit',
    customSubmitGetController
);
router.get(
  '/custom/submition',
    isLoggedIn,
    customSubmitionGetController
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
  '/custom/filter/save',
    isLoggedIn,
    customFilterSavePostController
);
router.post(
  '/filter/save',
    isLoggedIn,
    isComplete,
    isConfirmed,
    filterSavePostController
);

module.exports = router;
