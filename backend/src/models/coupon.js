const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const Coupon = sequelize.define('Coupon', {
    id: { type: DataTypes.UUID, defaultValue: () => uuidv4(), primaryKey: true },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      set(val) { this.setDataValue('code', String(val).toUpperCase().trim()); },
    },
    name: { type: DataTypes.STRING, allowNull: false },
    discountType: { type: DataTypes.ENUM('fixed', 'percentage'), allowNull: false, defaultValue: 'percentage' },
    discountValue: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    usageLimit: { type: DataTypes.INTEGER, allowNull: true }, // null = unlimited
    timesUsed: { type: DataTypes.INTEGER, defaultValue: 0 },
    expiresAt: { type: DataTypes.DATE, allowNull: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  }, {
    tableName: 'coupons',
    timestamps: true,
  });

  return Coupon;
};
