const fs = require('node:fs');
const path = require('node:path');

const filePath = path.join(__dirname, '..', 'data', 'user_prefs.json');

function loadAll() {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return {};
  }
}

function saveAll(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function getLanguage(userId) {
  const data = loadAll();
  return data[userId]?.language ?? null;
}

function setLanguage(userId, language) {
  const data = loadAll();
  data[userId] = { ...data[userId], language };
  saveAll(data);
}

module.exports = { getLanguage, setLanguage };
