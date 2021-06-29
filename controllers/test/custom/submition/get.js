// Find or create a Submition for the session user and target_id in query
// XMLHTTP Request

const User = require('../../../../models/user/User');

module.exports = (req, res) => {
  User.findOrCreateCustomSubmition(req.session.user._id, req.query.target_id, (err, submition) => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true, submition: submition }));
    return res.end();
  });
}
