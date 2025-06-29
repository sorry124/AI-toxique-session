export async function sendWelcomeMessage(sock, userJid, pasteUrl, welcomeMessage, welcomeImageUrl) {
  const messageText = `${welcomeMessage}\n${pasteUrl}`;

  await sock.sendMessage(userJid, {
    image: { url: welcomeImageUrl },
    caption: messageText,
  });
}
