const qrContainer = document.getElementById('qr-container');
const loadingSpinner = document.getElementById('spinner');
const errorMessage = document.getElementById('error');

async function fetchQR() {
  try {
    errorMessage.style.display = 'none';
    loadingSpinner.style.display = 'block';

    const response = await fetch('/api/qr');
    if (!response.ok) throw new Error('Erreur réseau');

    const data = await response.json();

    if (data.qr) {
      qrContainer.innerHTML = `<img src="data:image/svg+xml;base64,${data.qr}" alt="QR Code">`;
      loadingSpinner.style.display = 'none';
      document.getElementById('message').textContent = "Scannez le QR Code avec WhatsApp";
    } else {
      throw new Error('QR code non généré');
    }
  } catch (e) {
    loadingSpinner.style.display = 'none';
    qrContainer.innerHTML = '';
    errorMessage.style.display = 'block';
    errorMessage.textContent = `Erreur: ${e.message}`;
  }
}

setInterval(fetchQR, 3000);
fetchQR();
