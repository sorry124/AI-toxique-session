// backend/index.js
const express = require('express');
const { default: makeWASocket } = require('@whiskeysockets/baileys');

const app = express();
let currentQR = null;

async function startBaileys() {
  const sock = makeWASocket({ printQRInTerminal: true });

  sock.ev.on('connection.update', update => {
    if (update.qr) {
      currentQR = update.qr;
      console.log('QR:', currentQR);
    }
    if (update.connection === 'open') {
      currentQR = null;
      console.log('Connected');
    }
  });
}

startBaileys();

app.get('/api/qr', async (req, res) => {
  if (!currentQR) {
    return res.status(404).json({ error: 'Pas de QR code' });
  }
  try {
    const svg = await QRCode.toString(currentQR, { type: 'svg' });
    const base64SVG = Buffer.from(svg).toString('base64');
    res.json({ qr: base64SVG });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(8000, () => console.log('Serveur démarré sur http://localhost:8000'));
