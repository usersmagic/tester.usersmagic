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

  if (!body || !body.template || !body.to) return callback('bad_request');

  if (body.template == 'confirm_en') {
    if (!body.code || !body.name)
      return callback('bad_request');

    fetch(`https://api.elasticemail.com/v2/email/send?apiKey=${ELASTIC_EMAIL_API_KEY}&isTransactional=true&template=confirm_en&merge_name=${body.name}&merge_code=${body.code}&to=${body.to.trim()}&charset=utf-8`, {
      method: 'POST'
    })
      .then(data => data.json())
      .then(res => callback(null, res))
      .catch(err => callback('database_error'));
  } else if (body.template == 'confirm_tr') {
    if (!body.code || !body.name)
      return callback('bad_request');

    fetch(`https://api.elasticemail.com/v2/email/send?apiKey=${ELASTIC_EMAIL_API_KEY}&isTransactional=true&template=confirm_tr&merge_name=${encodeURIComponent(body.name.trim())}&merge_code=${encodeURIComponent(body.code.trim())}&to=${encodeURIComponent(body.to.trim())}&charset=utf-8`, {
      method: 'POST'
    })
      .then(data => data.json())
      .then(res => callback(null, res))
      .catch(err => callback('database_error'));
  } else if (body.template == 'password_lost_en') {
    if (!body.code || !body.name)
      return callback('bad_request');

    fetch(`https://api.elasticemail.com/v2/email/send?apiKey=${ELASTIC_EMAIL_API_KEY}&isTransactional=true&template=password_lost_en&merge_name=${encodeURIComponent(body.name)}&merge_email=${encodeURIComponent(body.to.trim())}&merge_code=${encodeURIComponent(body.code.trim())}&to=${encodeURIComponent(body.to.trim())}&charset=utf-8`, {
      method: 'POST'
    })
      .then(data => data.json())
      .then(res => callback(null, res))
      .catch(err => callback('database_error'));
  } else if (body.template == 'password_lost_tr') {
    if (!body.code || !body.name)
      return callback('bad_request');

    fetch(`https://api.elasticemail.com/v2/email/send?apiKey=${ELASTIC_EMAIL_API_KEY}&isTransactional=true&template=password_lost_tr&merge_name=${encodeURIComponent(body.name)}&merge_email=${encodeURIComponent(body.to.trim())}&merge_code=${encodeURIComponent(body.code.trim())}&to=${encodeURIComponent(body.to.trim())}&charset=utf-8`, {
      method: 'POST'
    })
      .then(data => data.json())
      .then(res => callback(null, res))
      .catch(err => callback('database_error'));
  } else {
    return callback('bad_request');
  }
};
