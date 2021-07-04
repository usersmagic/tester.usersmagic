// Create a temporary User using the email in body
// If the user already exists and is temporary, return its id
// If the user already exists and is not temporary, return error
// XMLHTTP Request

const User = require('../../../models/user/User');

module.exports = (req, res) => {
  User.createTemporaryUser(req.body, (err, user) => {
    if (!err && user) {
      req.session.user = user;
      res.write(JSON.stringify({ id: user._id.toString(), success: true }));
      return res.end();
    }

    if (err && err != 'email_duplication') { // There was an error and it is not email duplication
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    User.findTemporaryUser(req.body ? req.body.email : null, (err, user) => {
      if (err) {
        res.write(JSON.stringify({ error: err, success: false }));
        return res.end();
      }

      req.session.user = user;
      res.write(JSON.stringify({ id: user._id.toString(), success: true }));
      return res.end();
    });
  });
}
