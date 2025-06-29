const axios = require('axios');
const { PASTEBIN_API_KEY, PASTEBIN_API_USER_KEY } = require('./config');

async function uploadSessionToPastebin(sessionData) {
  const params = new URLSearchParams();
  params.append('api_dev_key', PASTEBIN_API_KEY);
  params.append('api_user_key', PASTEBIN_API_USER_KEY);
  params.append('api_option', 'paste');
  params.append('api_paste_code', sessionData);
  params.append('api_paste_private', '1');
  params.append('api_paste_expire_date', '1D'); // expiration 1 jour
  params.append('api_paste_name', `WhatsAppSession-${Date.now()}`);

  try {
    const response = await axios.post('https://pastebin.com/api/api_post.php', params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return response.data; // URL du paste créé
  } catch (error) {
    throw new Error('Erreur Pastebin: ' + error.message);
  }
}

module.exports = { uploadSessionToPastebin };
