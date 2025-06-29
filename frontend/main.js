const qrContainer = document.getElementById('qr-container');
const loadingSpinner = document.getElementById('loading-spinner');
const errorMessage = document.getElementById('error-message');

async function fetchQR() {
  try {
    errorMessage.style.display = 'none';   // cacher l’erreur
    loadingSpinner.style.display = 'block'; // afficher spinner pendant chargement

    const response = await fetch('/api/qr');
    if (!response.ok) throw new Error('Erreur réseau');

    const data = await response.json();

    if (data.qr) {
      // Affiche le QR code en image SVG ou base64 selon ce que tu renvoies
      qrContainer.innerHTML = `<img src="data:image/svg+xml;base64,${btoa(data.qr)}" alt="QR Code">`;

      loadingSpinner.style.display = 'none';  // cacher spinner
    } else {
      throw new Error('QR code non généré');
    }
  } catch (e) {
    loadingSpinner.style.display = 'none';    // cacher spinner
    qrContainer.innerHTML = '';                // vider QR
    errorMessage.style.display = 'block';     // afficher erreur
    errorMessage.textContent = `Erreur: ${e.message}`;
  }
}

// Polling toutes les 3 secondes
setInterval(fetchQR, 3000);

// Premier appel direct au chargement page
fetchQR();
