// Get /auth/change_password with the email and code given in the query

module.exports = (req, res) => {
  if (!req.query || !req.query.email || !req.query.code)
    return res.redirect('/auth/login');

  return res.render('auth/change_password', {
    page: 'auth/change_password',
    title: res.__('Change Password'),
    includes: {
      external: {
        css: ['page', 'general', 'inputs', 'buttons', 'auth', 'fontawesome'],
        js: ['page', 'serverRequest']
      }
    },
    code: req.query.code,
    email: req.query.email,
    language_key: req.query.lang ? req.query.lang : null
  });
}
