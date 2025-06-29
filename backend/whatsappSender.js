async function sendWelcomeMessage(client, userJid, sessionShortCode, photoUrl) {
  const messageText = `
Bonjour ! 🐳

Ta session WhatsApp a bien été générée et sauvegardée en toute sécurité.

Voici ton code de session unique : 
${sessionShortCode}

Conserve bien ce code, il te permettra de récupérer ta session complète.

Merci d'utiliser notre service !
  `.trim();

  await client.sendMessage(userJid, {
    image: { url: photoUrl },
    caption: messageText,
  });
}

module.exports = { sendWelcomeMessage };
