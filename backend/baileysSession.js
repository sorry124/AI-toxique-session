const makeWASocket = require('@whiskeysockets/baileys').default;
const { Boom } = require('@hapi/boom');
const { sendWelcomeMessage } = require('./whatsappSender');
const { uploadSessionToPastebin } = require('./pastebin');
// ✅ Correction : tout est dans une fonction async
async function handleWelcome() {
  try {
    await sendWelcomeMessage(sock, userJid, sessionShortCode, PHOTO_URL);
  } catch (error) {
    console.error("Erreur lors de l'envoi du message de bienvenue :", error);
  }
}

handleWelcome();

async function startBaileysSession(userJid) {
  const sock = makeWASocket({
    printQRInTerminal: true,
  });

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) {
      console.log('QR code généré:', qr);
      // Ici, tu dois envoyer ce QR au frontend ou gérer l'affichage
    }
    if (connection === 'close') {
      const err = lastDisconnect?.error;
      if (err?.output?.statusCode !== 401) {
        console.log('Connexion fermée avec erreur:', err);
      } else {
        console.log('Connexion fermée, déconnexion normale');
      }
    }
    if (connection === 'open') {
      console.log('Connexion WhatsApp établie.');

      // Générer la session brute complète
      const authInfo = sock.authState; // Contient la session complète
      const sessionJSON = JSON.stringify(authInfo, null, 2);

      // Poster sur Pastebin
      try {
        const pasteUrl = await uploadSessionToPastebin(sessionJSON);
        console.log('Session uploadée sur Pastebin:', pasteUrl);

        // Générer un sessionShortCode unique (exemple simple)
        const sessionShortCode = `BABY-MD~BOT~${Buffer.from(pasteUrl).toString('base64').slice(0, 20)}`;

        // Envoyer message de bienvenue
        await sendWelcomeMessage(sock, userJid, sessionShortCode, PHOTO_URL, WELCOME_MESSAGE_TEMPLATE);

        console.log('Message de bienvenue envoyé.');
      } catch (err) {
        console.error('Erreur durant le workflow:', err);
      }
    }
  });

  return sock;
}

module.exports = { startBaileysSession };
