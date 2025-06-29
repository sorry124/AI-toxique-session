export const config = {
  pastebinApiKey: process.env.PASTEBIN_API_KEY,
  welcomeMessage: process.env.WELCOME_MESSAGE || 'Bienvenue ! Ta session est prête :',
  welcomeImageUrl: process.env.WELCOME_IMAGE_URL || '',
  port: process.env.PORT || 3000,
};
