const crypto = require('crypto');

// Secrets that must live in the database (so Super Admin can manage them via
// the UI instead of editing server .env files) are encrypted at rest with
// this helper, using a key derived from ENCRYPTION_KEY. This is NOT a
// replacement for keeping the underlying provider credentials themselves
// safe - it protects the value if the database is ever exposed on its own.
const ALGO = 'aes-256-gcm';

function getKey() {
  const raw = process.env.ENCRYPTION_KEY;
  if (!raw) {
    throw new Error('ENCRYPTION_KEY is not set. Generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
  }
  return crypto.createHash('sha256').update(raw).digest();
}

function encrypt(plainText) {
  if (plainText === null || plainText === undefined || plainText === '') return null;
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(String(plainText), 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, encrypted]).toString('base64');
}

function decrypt(cipherText) {
  if (!cipherText) return null;
  try {
    const data = Buffer.from(cipherText, 'base64');
    const iv = data.subarray(0, 12);
    const authTag = data.subarray(12, 28);
    const encrypted = data.subarray(28);
    const decipher = crypto.createDecipheriv(ALGO, getKey(), iv);
    decipher.setAuthTag(authTag);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
  } catch {
    return null;
  }
}

/** Masks a secret for display in the admin UI, e.g. "sk_test_•••••••••1234" */
function maskSecret(value) {
  if (!value) return '';
  if (value.length <= 4) return '••••';
  return `${'•'.repeat(Math.max(value.length - 4, 4))}${value.slice(-4)}`;
}

module.exports = { encrypt, decrypt, maskSecret };
