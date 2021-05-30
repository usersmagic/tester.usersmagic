// Get /confirm page. If there is a code on query, confirm the account. Otherwise send a register mail to user mail and serve the /confirm pug file

const User = require('../../../models/user/User');

const sendMail = require('../../../utils/sendMail');

module.exports = (req, res) => {
  User.confirmUser(req.query.code, err => {
    if (!err) // The user is succesfully confirmed
      return res.redirect('/filters');

    const user = req.session.user;

    if (user.confirmed)
      return res.redirect('/campaigns');

    User.getConfirmCodeOfUser(user._id, (err, code) => {
      if (err) return res.redirect('/');

      sendMail({
        template: user.country == 'tr' ? 'confirm_tr' : 'confirm_en',
        name:  user.name ? user.name.split(' ')[0] : user.email,
        code: code,
        to: user.email
      }, err => {
        if (err) return res.redirect('/auth/email_error');

        return res.render('auth/confirm', {
          page: 'auth/confirm',
          title: res.__('Confirm Your Email'),
          includes: {
            external: {
              css: ['page', 'general', 'inputs', 'buttons', 'auth', 'fontawesome'],
              js: ['page']
            }
          },
          user: req.session.user,
          language_key: req.query.lang ? req.query.lang : null
        });
      });
    });
  });
}
