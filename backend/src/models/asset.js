const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const Asset = sequelize.define('Asset', {
    id: { type: DataTypes.UUID, defaultValue: () => uuidv4(), primaryKey: true },
    companyId: { type: DataTypes.UUID, allowNull: false },
    categoryId: { type: DataTypes.UUID, allowNull: true },

    // Unique identifier for the asset - used on the printed/generated QR label
    assetTag: { type: DataTypes.STRING, allowNull: false, unique: true },
    qrToken: { type: DataTypes.STRING, allowNull: false, unique: true }, // opaque token embedded in QR code

    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    serialNumber: { type: DataTypes.STRING, allowNull: true },
    brand: { type: DataTypes.STRING, allowNull: true },
    model: { type: DataTypes.STRING, allowNull: true },
    color: { type: DataTypes.STRING, allowNull: true },

    manufactureYear: { type: DataTypes.INTEGER, allowNull: true },
    purchaseDate: { type: DataTypes.DATEONLY, allowNull: true },
    purchasePrice: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
    currency: { type: DataTypes.STRING, defaultValue: 'GHS' },

    // Life expectancy as provided by the user (can override the category/AI default)
    lifeExpectancyYearsOverride: { type: DataTypes.FLOAT, allowNull: true },

    // ---- AI-Driven Disposable Period Proposal (see depreciationEngine.js) ----
    aiUsefulLifeYears: { type: DataTypes.FLOAT, allowNull: true },
    aiScrapValue: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
    aiSuggestedDisposalDate: { type: DataTypes.DATEONLY, allowNull: true },
    aiEstimatedCurrentValue: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
    aiLastCalculatedAt: { type: DataTypes.DATE, allowNull: true },
    aiOverridden: { type: DataTypes.BOOLEAN, defaultValue: false },
    // ---------------------------------------------------------------------

    status: {
      type: DataTypes.ENUM('available', 'assigned', 'in_maintenance', 'disposed', 'lost', 'reserved'),
      defaultValue: 'available',
    },
    condition: {
      type: DataTypes.ENUM('new', 'good', 'fair', 'poor', 'damaged'),
      defaultValue: 'good',
    },

    currentLocationId: { type: DataTypes.UUID, allowNull: true },

    // Fallback free-text location for individuals/small setups without defined checkpoints
    freeTextLocation: { type: DataTypes.STRING, allowNull: true },

    photoUrl: { type: DataTypes.STRING, allowNull: true },
    isArchived: { type: DataTypes.BOOLEAN, defaultValue: false },
  }, {
    tableName: 'assets',
    timestamps: true,
    indexes: [
      { fields: ['companyId'] },
      { fields: ['companyId', 'status'] },
    ],
  });

  return Asset;
};
