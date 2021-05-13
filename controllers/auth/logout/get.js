// Delete session and redirect to /auth/login

module.exports = (req, res) => {
  req.session.destroy();
  return res.redirect('/auth/login');
}
