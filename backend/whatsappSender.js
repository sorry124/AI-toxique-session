async function sendWelcomeMessage(client, userJid, sessionShortCode, photoUrl, messageTemplate) {
  const messageText = messageTemplate.replace('{sessionShortCode}', sessionShortCode);

  await client.sendMessage(userJid, {
    image: { url: photoUrl },
    caption: messageText,
  });
}

module.exports = { sendWelcomeMessage };
