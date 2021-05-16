// Reset the password of the given User

const User = require('../../../models/user/User');

module.exports = (req, res) => {
  User.resetPassword(req.body, err => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true }));
    return res.end();
  });
};
