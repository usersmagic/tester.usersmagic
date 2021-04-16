module.exports = (req, res) => {
  return res.render('auth/email_error', {
    page: 'auth/email_error',
    title: res.__('Email Error'),
    includes: {
      external: {
        css: ['page', 'general', 'inputs', 'buttons', 'auth', 'fontawesome']
      }
    },
    user: req.session.user,
    language_key: req.query.lang ? req.query.lang : null
  });
}
