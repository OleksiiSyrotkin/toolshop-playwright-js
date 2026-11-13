function parsePrice(text) {
  return Number(text.replace(/[^\d.]/g, ''));
}

function round2(value) {
  return Math.round(value * 100) / 100;
}

module.exports = { parsePrice, round2 };
