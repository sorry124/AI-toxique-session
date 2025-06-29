import express from 'express';
import cors from 'cors';
import { SessionManager } from './baileysSession.js';
import { uploadSessionToPastebin } from './pastebin.js';
import { sendWelcomeMessage } from './whatsappSender.js';
import { config } from './config.js';

const app = express();
app.use(cors());
app.use(express.json());

const sessionManager = new SessionManager();

let currentQr = null;

sessionManager.on('qr', (qr) => {
  currentQr = qr;
});

sessionManager.on('connected', () => {
  console.log('WhatsApp connecté');
});

await sessionManager.start();

// Endpoint pour récupérer le QR code (frontend appelle ça pour afficher le QR)
app.get('/qr', (req, res) => {
  if (!currentQr) return res.status(404).send('QR non disponible');
  res.send({ qr: currentQr });
});

// Endpoint appelé par le frontend une fois la session générée
app.post('/session', async (req, res) => {
  try {
    const { session } = req.body; // session brute envoyée par Baileys depuis le frontend
    if (!session) return res.status(400).send('Session manquante');

    // Upload sur Pastebin
    const pasteUrl = await uploadSessionToPastebin(session);

    // Générer un token ID court (exemple simple ici)
    const shortSessionId = `BABY-MD~BOT~${Math.random().toString(36).slice(2, 10)}`;

    // Récupérer le numéro WhatsApp (jid) de la session - tu dois adapter selon comment tu reçois ce numéro
    // Ici on suppose que le client envoie son numéro dans req.body.userJid
    const userJid = req.body.userJid;
    if (!userJid) return res.status(400).send('Numéro WhatsApp manquant');

    // Envoi message privé au user
    await sendWelcomeMessage(sessionManager.sock, userJid, pasteUrl, config.welcomeMessage, config.welcomeImageUrl);

    // Réponse au frontend
    res.send({ pasteUrl, shortSessionId });
  } catch (e) {
    console.error(e);
    res.status(500).send('Erreur interne');
  }
});

app.listen(config.port, () => {
  console.log(`Serveur démarré sur http://localhost:${config.port}`);
});
