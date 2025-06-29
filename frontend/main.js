
const qrContainer = document.getElementById('qr-container');
const loadingSpinner = document.getElementById('spinner');
const errorMessage = document.getElementById('error');

async function fetchQR() {
  try {
    errorMessage.style.display = 'none';
    loadingSpinner.style.display = 'block';

    const res = await fetch('/api/qr');
    const data = await res.json();

    if (data.qr) {
      qrContainer.innerHTML = '<img src="' + data.qr + '" />';
      loadingSpinner.style.display = 'none';
    } else {
      throw new Error('QR non dispo');
    }
  } catch (err) {
    loadingSpinner.style.display = 'none';
    errorMessage.style.display = 'block';
    errorMessage.innerText = 'Erreur: ' + err.message;
  }
}

fetchQR();
setInterval(fetchQR, 3000);
        