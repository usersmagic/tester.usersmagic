window.onload = () => {
  // listenDropDownListInputs(document); // Listen for drop down items

  // const countries = JSON.parse(document.getElementById('countries').value);
  // const countryInput = document.getElementById('country-input');

  // document.addEventListener('focusout', event => {
  //   if (event.target.id == 'country-visible-input')
  //     setTimeout(() => {
  //       document.querySelector('.phone-code').innerHTML = '+' + (countries.find(country => country.alpha2_code == countryInput.value) ? countries.find(country => country.alpha2_code == countryInput.value).phone_code : '0');
  //     }, 100);
  // });

  const closeAccountOuterWrapper = document.querySelector('.close-account-outer-wrapper');

  const nameInput = document.getElementById('name-input');
  const phoneCode = document.querySelector('phone-code');
  const phoneInput = document.querySelector('phone-input');
  const closeAccountEmailInput = document.getElementById('close-account-email-input');
  const closeAccountPasswordInput = document.getElementById('close-account-password-input');

  const logoutTitle = document.querySelector('.logout-title').innerHTML;
  const closeAccountTitle = document.querySelector('.close-account-title').innerHTML;
  const closeAccountText = document.querySelector('.close-account-text').innerHTML;
  const confirmText = document.querySelector('.confirm-text').innerHTML;
  const cancelText = document.querySelector('.cancel-text').innerHTML;

  const badRequestError = document.getElementById('bad-request-error').innerHTML;
  const authenticationError = document.getElementById('authentication-error').innerHTML;
  const networkError = document.getElementById('network-error').innerHTML;
  const unknownError = document.getElementById('unknown-error').innerHTML;

  const closeAccountError = document.querySelector('.close-account-error');

  document.addEventListener('click', event => {
    if (event.target.classList.contains('logout-button') || event.target.parentNode.classList.contains('logout-button')) {
      createConfirm({
        title: logoutTitle,
        text: '',
        accept: confirmText,
        reject: cancelText
      }, res => {
        if (res) return window.location = '/auth/logout';
      });
    }

    // if (event.target.classList.contains('update-button') || event.target.parentNode.classList.contains('update-button')) {
    //   serverRequest('/profile/update', 'POST', {
    //     name: nameInput.value,
    //     phone: phoneCode.innerHTML + phoneInput.value
    //   }, res => {
    //     if (!res.success) {
    //       createConfirm({

    //       })
    //     }


    //   })
    // }

    if (event.target.classList.contains('close-account-button') || event.target.parentNode.classList.contains('close-account-button')) {
      closeAccountOuterWrapper.style.display = 'flex';
    }

    if (event.target.classList.contains('close-account-outer-wrapper') || event.target.classList.contains('close-account-back-button') || event.target.parentNode.classList.contains('close-account-back-button')) {
      closeAccountOuterWrapper.style.display = 'none';
    }
    
    if (event.target.classList.contains('close-account-confirm-button') || event.target.parentNode.classList.contains('close-account-confirm-button')) {
      if (!closeAccountPasswordInput.value || !closeAccountPasswordInput.value.length)
        return closeAccountError.innerHTML = badRequestError;
      
      serverRequest('/auth/close', 'POST', {
        password: closeAccountPasswordInput.value
      }, res => {
        if (res.success)
          return window.location.reload();

        if (res.error == 'password_verification')
          closeAccountError.innerHTML = authenticationError;
        else if (res.error == 'network_error')
          closeAccountError.innerHTML = networkError;
        else
          closeAccountError.innerHTML = unknownError;
      });
    }
  })
}
