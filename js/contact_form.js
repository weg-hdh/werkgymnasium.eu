let isCloudflarePassed = false;

function _turnstileCb() {
  console.debug('_turnstileCb called');

  turnstile.render('#cf-turnstile', {
    sitekey: "0x4AAAAAAA4JdyZYUjbkhdE0",
    theme: 'light',
    callback: function() {
      isCloudflarePassed = true;
      updateSubmitButtonState();
    },
  });
}

function updateSubmitButtonState() {
  const dataConsentCheckbox = document.getElementById('dataConsent');
  const searchButton = document.getElementById('search-button');

  if (dataConsentCheckbox.checked && isCloudflarePassed) {
    searchButton.removeAttribute('disabled');
  } else {
    searchButton.setAttribute('disabled', 'true');
  }
}

document.getElementById('dataConsent').addEventListener('change', updateSubmitButtonState);

document.getElementById('helpForm').addEventListener('submit', function(event) {
  event.preventDefault();

  var searchButton = document.getElementById('search-button');
  if (searchButton) {
    searchButton.setAttribute('disabled', 'true');
  }

  const formData = new FormData(this);

  fetch('https://api.werkgymnasium.eu/api/form', {
    method: 'POST',
    body: formData,
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(response.status);
    }
  })
  .then(data => {
    document.getElementById('formResponse').innerHTML = `<p style="color: green;">Vielen Dank für Ihre Nachricht. Bitte überprüfen Sie Ihr Email-Postfach und bestätigen Sie den Vorgang. Ihre Vorgangsnummer lautet: <strong>${data.id}</strong></p>`;
    document.getElementById('helpForm').reset();
    updateSubmitButtonState();
  })
  .catch(error => {
    let errorMessage;
    if (error.message === '401') {
      errorMessage = '<p style="color: red;">Serverfehler: Bitte versuchen Sie es später erneut.</p>';
    } else if (error.message === '500') {
      errorMessage = '<p style="color: red;">Serverfehler: Bitte versuchen Sie es später erneut.</p>';
    } else {
      errorMessage = '<p style="color: red;">Es gab ein Problem beim Senden des Formulars. Bitte versuchen Sie es später erneut.</p>';
    }
    document.getElementById('formResponse').innerHTML = errorMessage;
    console.error('Error:', error);
    if (searchButton) {
      searchButton.removeAttribute('disabled');
    }
  });
});