const messages = {
  en: require('./en.json'),
};

export function getMessages(locale) {
  const langCode = locale.split(/[-_]/)[0];
  return messages[langCode] || messages.en;
}
