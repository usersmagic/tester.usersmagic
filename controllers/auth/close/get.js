// Get the /auth/close page

module.exports = (req, res) => {
  return res.render('auth/close', {
    page: 'auth/close',
    title: res.__('Account is Closed'),
    includes: {
      external: {
        css: ['page', 'general', 'auth', 'fontawesome']
      }
    },
    email: req.query.email
  });
}
