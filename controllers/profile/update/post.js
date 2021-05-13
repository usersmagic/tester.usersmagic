// Update the User account with the given data on req.body
// XMLHTTP Request

const User = require('../../../models/user/User');

module.exports = (req, res) => {
  User.updateUser(req.session.user.email, req.body, err => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true }));
    return res.end();
  })
}
