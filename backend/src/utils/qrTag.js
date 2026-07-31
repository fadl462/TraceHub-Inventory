const QRCode = require('qrcode');
const crypto = require('crypto');

/** Generates a short, human-typeable asset tag e.g. TH-8F3K2Q1 */
function generateAssetTag() {
  const rand = crypto.randomBytes(4).toString('hex').toUpperCase().slice(0, 6);
  return `TH-${rand}`;
}

/** Generates an opaque, hard-to-guess token to embed in the QR code payload */
function generateQrToken() {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Returns a base64 PNG data URL for the given asset's scan URL.
 * The QR encodes a public scan-landing URL: {CLIENT_URL}/scan/{qrToken}
 * which the mobile scan page resolves via the API.
 */
async function generateQrDataUrl(qrToken) {
  const scanUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/scan/${qrToken}`;
  return QRCode.toDataURL(scanUrl, { margin: 1, width: 320, color: { dark: '#1A4D8F', light: '#F4F7FA' } });
}

module.exports = { generateAssetTag, generateQrToken, generateQrDataUrl };
