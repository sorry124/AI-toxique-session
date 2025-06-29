
async function sendWelcomeMessage(sock, jid, sessionCode, imageUrl, template) {
  if (!jid) return;

  const message = template.replace('{{SESSION}}', sessionCode);

  await sock.sendMessage(jid, {
    image: { url: imageUrl },
    caption: message,
  });
}

module.exports = { sendWelcomeMessage };
        