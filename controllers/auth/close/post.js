// Close the User account with the given email and password
// XMLHTTP Request

const User = require('../../../models/user/User');

module.exports = (req, res) => {
  User.closeAccount(req.session.user.email, req.body ? req.body.password : null, err => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true }));
    return res.end();
  });
}
