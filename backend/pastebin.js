
const axios = require('axios');

async function uploadSessionToPastebin(sessionContent) {
  const pasteKey = process.env.PASTEBIN_API_KEY;
  const username = process.env.PASTEBIN_USERNAME;

  const res = await axios.post('https://pastebin.com/api/api_post.php', null, {
    params: {
      api_dev_key: pasteKey,
      api_option: 'paste',
      api_user_key: '',
      api_paste_code: `BOT-${Date.now()}`,
      api_paste_name: 'WHATSAPP_SESSION',
      api_paste_private: 1,
      api_paste_expire_date: '1D',
      api_paste_format: 'text',
      api_paste_text: sessionContent,
    },
  });

  return res.data;
}

module.exports = { uploadSessionToPastebin };
        