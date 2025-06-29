const qrContainer = document.getElementById('qr-container');
const loadingSpinner = document.getElementById('spinner');
const errorMessage = document.getElementById('error');
const messageText = document.getElementById('message');

async function fetchQR() {
  try {
    errorMessage.style.display = 'none';
    loadingSpinner.style.display = 'block';

    const response = await fetch('/api/qr');
    const data = await response.json();

    if (data.qr) {
      qrContainer.innerHTML = ''; // clear previous QR
      new QRCode(qrContainer, {
        text: data.qr,
        width: 256,
        height: 256,
        colorDark: '#000',
        colorLight: '#fff',
        correctLevel: QRCode.CorrectLevel.H
      });

      loadingSpinner.style.display = 'none';
      messageText.textContent = '✅ Scannez le QR code avec WhatsApp';
    } else {
      throw new Error('QR code non généré');
    }
  } catch (e) {
    loadingSpinner.style.display = 'none';
    qrContainer.innerHTML = '';
    errorMessage.style.display = 'block';
    errorMessage.textContent = `❌ Erreur: ${e.message}`;
  }
}

setInterval(fetchQR, 3000);
fetchQR();
