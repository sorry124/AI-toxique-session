const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const { sendWelcomeMessage } = require('./whatsappSender');
const { uploadSessionToPastebin } = require('./pastebin');
const path = require('path');

async function startBaileysSession(userJid) {
  const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, './session'));

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log('QR code généré:', qr);
      // ➕ TODO : envoyer le QR au frontend via WebSocket ou endpoint API
    }

    if (connection === 'close') {
      const err = lastDisconnect?.error;
      if (err?.output?.statusCode !== 401) {
        console.log('Connexion fermée avec erreur:', err);
      } else {
        console.log('Déconnecté normalement');
      }
    }

    if (connection === 'open') {
      console.log('✅ Connexion WhatsApp établie.');

      try {
        const sessionJSON = JSON.stringify(state, null, 2);

        const pasteUrl = await uploadSessionToPastebin(sessionJSON);
        console.log('📤 Session uploadée sur Pastebin:', pasteUrl);

        const sessionShortCode = `BABY-MD~BOT~${Buffer.from(pasteUrl).toString('base64').slice(0, 20)}`;

        await sendWelcomeMessage(sock, userJid, sessionShortCode, process.env.PHOTO_URL, process.env.WELCOME_MESSAGE_TEMPLATE);

        console.log('📩 Message de bienvenue envoyé.');
      } catch (err) {
        console.error('❌ Erreur dans le workflow :', err);
      }
    }
  });

  return sock;
}

module.exports = { startBaileysSession };
