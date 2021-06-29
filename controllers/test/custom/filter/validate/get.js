// Validate the session user to join the Target with the given id
// XMLHTTP Request

const User = require('../../../../../models/user/User');

module.exports = (req, res) => {
  User.validateUserToJointarget(req.session.user._id, req.query.target_id, (err, result) => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true, res: result }));
    return res.end();
  });
}
