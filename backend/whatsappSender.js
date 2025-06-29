import { proto } from '@adiwajshing/baileys';

export async function sendWelcomeMessage(sock, userJid, pasteUrl, welcomeMessage, welcomeImageUrl) {
  const messageText = `${welcomeMessage}\n${pasteUrl}`;

  // Envoi du texte + image
  await sock.sendMessage(userJid, {
    image: { url: welcomeImageUrl },
    caption: messageText,
  });
}
