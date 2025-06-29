module.exports = {
  PASTEBIN_API_KEY: process.env.PASTEBIN_API_KEY,
  PASTEBIN_API_USER_KEY: process.env.PASTEBIN_API_USER_KEY,
  PHOTO_URL: process.env.PHOTO_URL,
  WELCOME_MESSAGE_TEMPLATE: `
Bonjour ! 🐳

Ta session WhatsApp a bien été générée et sauvegardée en toute sécurité.

Voici ton code de session unique : 
{sessionShortCode}

Conserve bien ce code, il te permettra de récupérer ta session complète.

Merci d'utiliser notre service !
`.trim(),
};
