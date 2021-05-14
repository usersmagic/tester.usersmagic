const fetch = require('node-fetch');

module.exports = (body, callback) => {
  /*
    data: {
      title: String,
      text: String,
      url: String,
      button: String
    },
    to: String,
    subject: String
  */

  const ELASTIC_EMAIL_API_KEY = process.env.ELASTIC_EMAIL_API_KEY;

  if (!body || !body.data || !body.subject || !body.to)
    return callback('bad_request');

  fetch(`https://api.elasticemail.com/v2/email/send?apiKey=${ELASTIC_EMAIL_API_KEY}&isTransactional=true&template=title_text_button&merge_title=${encodeURIComponent(body.data.title)}&merge_text=${encodeURIComponent(body.data.text)}&merge_url=${encodeURIComponent(body.data.url)}&merge_button=${encodeURIComponent(body.data.button)}&to=${body.to.trim()}&subject=${encodeURIComponent(body.subject)}&charset=utf-8`, {
    method: 'POST'
  })
    .then(data => data.json())
    .then(res => callback(null, res))
    .catch(err => callback('database_error'));
};
