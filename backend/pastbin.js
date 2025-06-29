import fetch from 'node-fetch';

export async function uploadSessionToPastebin(sessionData) {
  const body = new URLSearchParams({
    api_dev_key: 'Tto1zQt8Ma5j7h_K9E_FG7fZJWhFDcIx',
    api_option: 'paste',
    api_paste_code: JSON.stringify(sessionData),
    api_paste_private: '1', // privée
    api_paste_expire_date: '1H', // expire en 1h
    api_paste_name: `Session_${Date.now()}`,
  });

  const res = await fetch('https://pastebin.com/api/api_post.php', {
    method: 'POST',
    body,
  });

  if (!res.ok) {
    throw new Error(`Pastebin upload failed: ${res.statusText}`);
  }

  const pasteUrl = await res.text();
  return pasteUrl;
}
