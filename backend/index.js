const express = require('express');
const { startBaileysSession } = require('./baileysSession');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/start-session/:userJid', async (req, res) => {
  const userJid = req.params.userJid;
  try {
    const sock = await startBaileysSession(userJid);
    res.json({ success: true, message: 'Session started for ' + userJid });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});
