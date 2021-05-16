module.exports = (req, res) => {
  return res.render('auth/lost_password', {
    page: 'auth/lost_password',
    title: res.__('Reset Password'),
    includes: {
      external: {
        css: ['page', 'general', 'inputs', 'buttons', 'auth', 'fontawesome'],
        js: ['page', 'serverRequest']
      }
    },
    language_key: req.query.lang ? req.query.lang : null
  });
}
