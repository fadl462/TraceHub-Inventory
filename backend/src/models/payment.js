const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    id: { type: DataTypes.UUID, defaultValue: () => uuidv4(), primaryKey: true },
    companyId: { type: DataTypes.UUID, allowNull: false },
    subscriptionId: { type: DataTypes.UUID, allowNull: true },
    provider: { type: DataTypes.STRING, defaultValue: 'flutterwave' },
    txRef: { type: DataTypes.STRING, allowNull: false, unique: true },
    flwTransactionId: { type: DataTypes.STRING, allowNull: true },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    currency: { type: DataTypes.STRING, defaultValue: 'USD' },
    status: {
      type: DataTypes.ENUM('pending', 'successful', 'failed', 'refunded'),
      defaultValue: 'pending',
    },
    paymentMethod: { type: DataTypes.STRING, allowNull: true },
    invoiceNumber: { type: DataTypes.STRING, allowNull: true, unique: true },
    invoiceUrl: { type: DataTypes.STRING, allowNull: true },
    meta: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '{}',
      get() {
        const raw = this.getDataValue('meta');
        try { return raw ? JSON.parse(raw) : {}; } catch { return {}; }
      },
      set(val) { this.setDataValue('meta', JSON.stringify(val || {})); },
    },
    paidAt: { type: DataTypes.DATE, allowNull: true },
  }, {
    tableName: 'payments',
    timestamps: true,
  });

  return Payment;
};
