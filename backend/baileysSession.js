const { default: makeWASocket, useSingleFileAuthState } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const fs = require('fs');

const { state, saveState } = useSingleFileAuthState('./session.json');

function startBaileysSession(userJid, onQR) {
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    browser: ['Ubuntu', 'Chrome', '22.04'], // 👈 simulate un appareil classique
  });

  sock.ev.on('connection.update', (update) => {
    const { connection, qr } = update;

    if (qr) {
      console.log('[QR] Nouveau QR généré');
      onQR(qr);
    }

    if (connection === 'open') {
      console.log('[OK] Connecté à WhatsApp ✅');
    }

    if (connection === 'close') {
      const shouldReconnect = update.lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('[!] Déconnecté. Reconnexion :', shouldReconnect);
      if (shouldReconnect) startBaileysSession(userJid, onQR);
    }
  });

  sock.ev.on('creds.update', saveState);
}

module.exports = { startBaileysSession };
