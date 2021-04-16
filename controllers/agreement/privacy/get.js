module.exports = (req, res) => {
  const current_language = req.query.lang ? req.query.lang : (req.headers["accept-language"] ? req.headers["accept-language"].split('-')[0] : null);

  return res.render('agreement/privacy', {
    page: 'agreement/privacy',
    title: res.__('Gizlilik Sözleşmesi'),
    includes: {
      external: {
        css: ['page']
      }
    },
    current_language
  });
}
