const makeWASocket = require('@whiskeysockets/baileys').default;
const { sendWelcomeMessage } = require('./whatsappSender');
const { uploadSessionToPastebin } = require('./pastebin');

async function startBaileysSession(userJid) {
  const sock = makeWASocket({
    printQRInTerminal: true,
  });

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log('QR code généré:', qr);
      // Ici tu peux envoyer ce QR au frontend
    }

    if (connection === 'close') {
      const err = lastDisconnect?.error;
      if (err?.output?.statusCode !== 401) {
        console.log('Connexion fermée avec erreur:', err);
      } else {
        console.log('Connexion fermée normalement');
      }
    }

    if (connection === 'open') {
      console.log('Connexion WhatsApp établie.');

      try {
        const authInfo = sock.authState; // session complète
        const sessionJSON = JSON.stringify(authInfo, null, 2);

        // Upload complet sur Pastebin (stockage côté serveur)
        const pasteUrl = await uploadSessionToPastebin(sessionJSON);
        console.log('Session uploadée sur Pastebin:', pasteUrl);

        // Génère un code court à envoyer (seulement)
        const sessionShortCode = `BABY-MD~BOT~${Buffer.from(pasteUrl).toString('base64').slice(0, 20)}`;

        // Envoie juste ce code à l'utilisateur, PAS le lien
        const welcomeText = `✨ Voici ta session ID :\n${sessionShortCode}\n\nÀ utiliser dans ton bot 🤖`;

        await sendWelcomeMessage(sock, userJid, welcomeText, process.env.PHOTO_URL);

        console.log('Message de bienvenue envoyé.');
      } catch (err) {
        console.error('Erreur durant le workflow:', err);
      }
    }
  });

  return sock;
}

module.exports = { startBaileysSession };
