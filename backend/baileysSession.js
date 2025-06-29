
const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const { sendWelcomeMessage } = require('./whatsappSender');
const { uploadSessionToPastebin } = require('./pastebin');

const fs = require('fs');
const path = require('path');

async function startBaileysSession(userJid, onQR) {
  const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, '../session'));
  const sock = makeWASocket({ auth: state });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async ({ connection, lastDisconnect, qr }) => {
    if (qr && typeof onQR === 'function') onQR(qr);

    if (connection === 'open') {
      console.log('Connecté à WhatsApp');

      try {
        const sessionJSON = JSON.stringify(state, null, 2);
        const pasteUrl = await uploadSessionToPastebin(sessionJSON);

        const sessionShortCode = `BABY-MD~BOT~${Buffer.from(pasteUrl).toString('base64').slice(0, 20)}`;
        await sendWelcomeMessage(sock, userJid, sessionShortCode, process.env.PHOTO_URL, process.env.WELCOME_MESSAGE_TEMPLATE);
        console.log('Session envoyée avec succès.');
      } catch (err) {
        console.error('Erreur lors de l’envoi du message:', err);
      }
    }

    if (connection === 'close') {
      console.log('Connexion fermée');
    }
  });

  return sock;
}

module.exports = { startBaileysSession };
        