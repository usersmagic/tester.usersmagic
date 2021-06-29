// Save the given filter under session user
// XMLHTTP Request

const User = require('../../../../../models/user/User');

module.exports = (req, res) => {
  User.saveFilter(req.session.user._id, req.body, err => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true }));
    return res.end();
  });
}
