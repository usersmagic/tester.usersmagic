const express = require('express');
const router = express.Router();

const isComplete = require('../middleware/isComplete');
const isLoggedIn = require('../middleware/isLoggedIn');

const loginGetController = require('../controllers/auth/login/get');
const logoutGetController = require('../controllers/auth/logout/get');
const registerGetController = require('../controllers/auth/register/get');
const closeGetController = require('../controllers/auth/close/get');
const completeGetController = require('../controllers/auth/complete/get');
const confirmGetController = require('../controllers/auth/confirm/get');
const changePasswordGetController = require('../controllers/auth/change_password/get');
const emailErrorGetController = require('../controllers/auth/email_error/get');
const lostPasswordGetController = require('../controllers/auth/lost_password/get');
const userGetController = require('../controllers/auth/user/get');

const loginPostController = require('../controllers/auth/login/post');
const registerPostController = require('../controllers/auth/register/post');
const closePostController = require('../controllers/auth/close/post');
const completePostController = require('../controllers/auth/complete/post');
const lostPasswordPostController = require('../controllers/auth/lost_password/post');
const changePasswordPostController = require('../controllers/auth/change_password/post');

router.get(
  '/login',
    loginGetController
);
router.get(
  '/logout',
    isLoggedIn,
    logoutGetController
);
router.get(
  '/register',
    registerGetController
);
router.get(
  '/close',
    closeGetController
);
router.get(
  '/complete',
    isLoggedIn,
    completeGetController
);
router.get(
  '/confirm', 
    isLoggedIn,
    isComplete,
    confirmGetController
);
router.get(
  '/change_password',
    changePasswordGetController
);
router.get(
  '/email_error',
    isLoggedIn,
    emailErrorGetController
);
router.get(
  '/lost_password',
    lostPasswordGetController
);
router.get(
  '/user',
    userGetController
);

router.post(
  '/login',
    loginPostController
);
router.post(
  '/register',
    registerPostController
);
router.post(
  '/close',
    isLoggedIn,
    closePostController
);
router.post(
  '/complete',
    isLoggedIn,
    completePostController
);
router.post(
  '/lost_password',
    lostPasswordPostController
);
router.post(
  '/change_password',
    changePasswordPostController
);

module.exports = router;
