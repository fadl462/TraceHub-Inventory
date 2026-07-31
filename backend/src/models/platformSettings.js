const { encrypt, decrypt } = require('../utils/crypto');

// Singleton table (id fixed to 'default') for platform-wide settings the
// Super Admin manages through the UI instead of editing .env directly:
// branding (app name, logos, favicon), outbound email (SMTP), and the
// payment gateway (Flutterwave keys + sandbox/live mode). Secrets
// (SMTP password, Flutterwave secret key) are encrypted at rest.
module.exports = (sequelize, DataTypes) => {
  const PlatformSettings = sequelize.define('PlatformSettings', {
    id: { type: DataTypes.STRING, primaryKey: true, defaultValue: 'default' },

    // Branding
    appName: { type: DataTypes.STRING, defaultValue: 'TraceHub Inventory' },
    logoLightUrl: { type: DataTypes.STRING, allowNull: true },
    logoDarkUrl: { type: DataTypes.STRING, allowNull: true },
    faviconUrl: { type: DataTypes.STRING, allowNull: true },

    // SMTP
    smtpHost: { type: DataTypes.STRING, allowNull: true },
    smtpPort: { type: DataTypes.INTEGER, allowNull: true },
    smtpSecure: { type: DataTypes.BOOLEAN, defaultValue: false },
    smtpUser: { type: DataTypes.STRING, allowNull: true },
    smtpPasswordEncrypted: {
      type: DataTypes.TEXT,
      allowNull: true,
      // Transient virtual accessor so callers work with plaintext, while the
      // DB column only ever stores the encrypted value.
    },
    smtpSenderName: { type: DataTypes.STRING, defaultValue: 'TraceHub Inventory' },

    // Flutterwave
    flwMode: { type: DataTypes.ENUM('sandbox', 'live'), defaultValue: 'sandbox' },
    flwPublicKey: { type: DataTypes.STRING, allowNull: true },
    flwSecretKeyEncrypted: { type: DataTypes.TEXT, allowNull: true },
    flwEncryptionKeyEncrypted: { type: DataTypes.TEXT, allowNull: true },
  }, {
    tableName: 'platform_settings',
    timestamps: true,
  });

  // Plaintext virtual getters/setters over the encrypted columns, so the
  // rest of the app never has to know encryption is happening.
  PlatformSettings.prototype.getSmtpPassword = function getSmtpPassword() {
    return decrypt(this.smtpPasswordEncrypted);
  };
  PlatformSettings.prototype.setSmtpPassword = function setSmtpPassword(value) {
    this.smtpPasswordEncrypted = encrypt(value);
  };
  PlatformSettings.prototype.getFlwSecretKey = function getFlwSecretKey() {
    return decrypt(this.flwSecretKeyEncrypted);
  };
  PlatformSettings.prototype.setFlwSecretKey = function setFlwSecretKey(value) {
    this.flwSecretKeyEncrypted = encrypt(value);
  };
  PlatformSettings.prototype.getFlwEncryptionKey = function getFlwEncryptionKey() {
    return decrypt(this.flwEncryptionKeyEncrypted);
  };
  PlatformSettings.prototype.setFlwEncryptionKey = function setFlwEncryptionKey(value) {
    this.flwEncryptionKeyEncrypted = encrypt(value);
  };

  return PlatformSettings;
};
