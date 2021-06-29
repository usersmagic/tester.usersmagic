// Get the session user
// XMLHTTP Request

module.exports = (req, res) => {
  res.write(JSON.stringify({ user: req.session.user, success: true }));
  return res.end();
}
