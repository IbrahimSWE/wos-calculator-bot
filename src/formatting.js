const { t } = require('./i18n');

function formatNumber(value) {
  return Math.round(value).toLocaleString('en-US');
}

function formatDuration(lang, totalSeconds) {
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const parts = [];
  if (days > 0) parts.push(t(lang, 'unit_days', { value: days }));
  if (hours > 0) parts.push(t(lang, 'unit_hours', { value: hours }));
  if (minutes > 0) parts.push(t(lang, 'unit_minutes', { value: minutes }));
  if (seconds > 0 || parts.length === 0) parts.push(t(lang, 'unit_seconds', { value: seconds }));

  return parts.join(' ');
}

function formatResourceLine(lang, resource, amount) {
  return `${t(lang, `resource_${resource}`)}: **${formatNumber(amount)}**`;
}

module.exports = { formatNumber, formatDuration, formatResourceLine };
