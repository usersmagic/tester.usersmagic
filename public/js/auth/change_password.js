window.onload = () => {
  const changePasswordForm = document.querySelector('.change-password-form');

  const email = document.getElementById('email').value;
  const code = document.getElementById('code').value;

  const badRequestError = document.getElementById('bad-request-error');
  const requestTimeoutError = document.getElementById('request-timeout-error');
  const networkError = document.getElementById('network-error');
  const unknownError = document.getElementById('unknown-error');

  changePasswordForm.onsubmit = event => {
    event.preventDefault();

    badRequestError.style.display =
    requestTimeoutError.style.display =
    networkError.style.display =
    unknownError.style.display = 'none';

    const password = document.getElementById('password-input').value.trim();
    const confirmPassword = document.getElementById('confirm-password-input').value.trim();

    if (!password || !confirmPassword || password.length < 6 || password != confirmPassword)
      return badRequestError.style.display = 'block';

    serverRequest('/auth/change_password', 'POST', {
      email,
      code,
      password
    }, res => {
      if (!res.success) {
        if (res.error == 'bad_request' || res.error == 'password_length')
          return badRequestError.style.display = 'block';
        else if (res.error == 'request_timeout')
          return requestTimeoutError.style.display = 'block';
        else if (res.error == 'network_error')
          return networkError.style.display = 'block';
        else
          return unknownError.style.display = 'block';
      } else {
        return window.location = '/auth/login';
      }
    });
  }
}
