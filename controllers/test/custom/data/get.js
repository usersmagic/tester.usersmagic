// Get the custom Submition data
// XMLHTTP Request

const User = require('../../../../models/user/User');

module.exports = (req, res) => {
  User.getSubmitionProjectAndQuestions(req.query.id, req.session.user._id, (err, data) => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ success: true, data: data }));
    return res.end();
  });
}
