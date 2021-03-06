// Check if there is an account information on session, redirect to /auth/login if the request is not logged in

const User = require('../models/user/User');

module.exports = (req, res, next) => {
  if (req.session && req.session.user) {
    User.getUserById(req.session.user._id, (err, user) => {
      if (err || !user)
        return res.status(401).redirect('/auth/login' + ((req.query && req.query.lang) ? '?lang=' + req.query.lang : ''));;
      
      if (user.closed) // This account is closed
        return res.redirect(`/auth/close?email=` + user.email);

      req.session.user = user;
      User.updateLastLoginTime(req.session.user._id, err => {
        if (err) return res.redirect('/');

        return next();
      });
    });
  } else {
    req.session.redirect = req.originalUrl;
    if (req.query.code)
      req.session.redirect += '?code=' + req.query.code;
    res.status(401).redirect('/auth/login' + ((req.query && req.query.lang) ? '?lang=' + req.query.lang : ''));
  };
};
