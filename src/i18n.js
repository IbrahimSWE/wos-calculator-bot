const fs = require('node:fs');
const path = require('node:path');

const locales = {
  ar: JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'locales', 'ar.json'), 'utf8')),
  en: JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'locales', 'en.json'), 'utf8')),
};

function t(lang, key, vars = {}) {
  const dict = locales[lang] || locales.ar;
  let str = dict[key] ?? key;
  for (const [name, value] of Object.entries(vars)) {
    str = str.replaceAll(`{{${name}}}`, value);
  }
  return str;
}

module.exports = { t };
