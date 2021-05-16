window.onload = () => {
  const lostPasswordForm = document.querySelector('.lost-password-form');
  const resetPasswordButton = document.querySelector('.reset-password-button');
  let formSubmitted = false;

  const badRequestError = document.getElementById('bad-request-error');
  const notFoundError = document.getElementById('not-found-error');
  const networkError = document.getElementById('network-error');
  const unknownError = document.getElementById('unknown-error');
  const noError = document.getElementById('no-error');

  lostPasswordForm.onsubmit = event => {
    event.preventDefault();
    if (formSubmitted)
      return;

    badRequestError.style.display =
    notFoundError.style.display =
    networkError.style.display =
    unknownError.style.display =
    noError.style.display = 'none';

    const email = document.getElementById('email-input').value.trim();

    if (!email || !email.length)
      return badRequestError.style.display = 'block';

    serverRequest('/auth/lost_password', 'POST', {
      email
    }, res => {
      if (!res.success) {
        if (res.error == 'bad_request')
          return badRequestError.style.display = 'block';
        else if (res.error == 'document_not_found')
          return notFoundError.style.display = 'block';
        else if (res.error == 'network_error')
          return networkError.style.display = 'block';
        else
          return unknownError.style.display = 'block';
      } else {
        resetPasswordButton.style.display = 'none';
        noError.style.display = 'block';
        formSubmitted = true;
      }
    });
  }
}
