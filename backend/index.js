const crypto = require('crypto');
global.crypto = crypto;
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const QRCode = require('qrcode');
const { startBaileysSession } = require('./baileysSession');

const app = express();
app.use(cors());

// Sert les fichiers frontend
app.use(express.static(path.join(__dirname, '../frontend')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

let latestQR = null;
let userJid = process.env.OWNER_JID || '';

startBaileysSession(userJid, (qr) => {
  latestQR = qr;
});

app.get('/api/qr', async (req, res) => {
  if (!latestQR) return res.status(404).json({ error: 'QR non disponible' });
  try {
    const qrImage = await QRCode.toDataURL(latestQR);
    res.json({ qr: qrImage });
  } catch (err) {
    res.status(500).json({ error: 'Erreur QR' });
  }
});

app.listen(8000, () => console.log('Serveur démarré sur http://localhost:8000'));
