// Get the filters of Target using target_id and user_id (user must be temporary)
// XMLHTTP Request

const User = require('../../../../../models/user/User');

module.exports = (req, res) => {
  User.getFiltersBeforeCustomSubmition(req.session.user._id, req.query.target_id, (err, filters) => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ filters: filters, success: true }));
    return res.end();
  });
}
