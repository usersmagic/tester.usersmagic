// Update the reset password code and time of the User with the given email
// XMLHTTP Request

const User = require('../../../models/user/User');

const sendMail = require('../../../utils/sendMail');

module.exports = (req, res) => {
  User.updateResetPasswordCode(req.body, (err, user) => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    sendMail({
      template: user.country == 'tr' ? 'password_lost_tr' : 'password_lost_en',
      name: user.name.split(' ')[0],
      code: user.password_reset_code,
      to: user.email
    }, err => {
      if (err) {
        res.write(JSON.stringify({ error: err, success: false }));
        return res.end();
      }
  
      res.write(JSON.stringify({ success: true }));
      return res.end();
    });
  });
}
