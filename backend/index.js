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

app.get('/qr', (req, res) => {
  if (!currentQr) return res.status(404).send('QR non disponible');
  res.send({ qr: currentQr });
});

app.post('/session', async (req, res) => {
  try {
    const { session, userJid } = req.body;
    if (!session) return res.status(400).send('Session manquante');
    if (!userJid) return res.status(400).send('Numéro WhatsApp manquant');

    const pasteUrl = await uploadSessionToPastebin(session);

    const shortSessionId = `BABY-MD~BOT~${Math.random().toString(36).slice(2, 10)}`;

    await sendWelcomeMessage(sessionManager.sock, userJid, pasteUrl, config.welcomeMessage, config.welcomeImageUrl);

    res.send({ pasteUrl, shortSessionId });
  } catch (e) {
    console.error(e);
    res.status(500).send('Erreur interne');
  }
});

app.listen(config.port, () => {
  console.log(`Serveur démarré sur http://localhost:${config.port}`);
});
