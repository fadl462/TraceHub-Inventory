const { v4: uuidv4 } = require('uuid');

// This table is the knowledge-base the "AI-Driven Disposal Period" engine draws on
// (see src/utils/depreciationEngine.js). Each asset category maps to an expected
// useful life and scrap value percentage, refined by real usage data over time
// (i.e. once actual disposals are recorded, `sampleSize` and the estimates can be
// updated automatically instead of relying purely on the seeded defaults).
module.exports = (sequelize, DataTypes) => {
  const DepreciationProfile = sequelize.define('DepreciationProfile', {
    id: { type: DataTypes.UUID, defaultValue: () => uuidv4(), primaryKey: true },
    categoryId: { type: DataTypes.UUID, allowNull: false, unique: true },
    usefulLifeYears: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 5 },
    scrapValuePercent: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 10 }, // % of purchase price
    depreciationMethod: {
      type: DataTypes.ENUM('straight_line', 'declining_balance'),
      defaultValue: 'straight_line',
    },
    source: {
      type: DataTypes.ENUM('builtin', 'ai_estimated', 'manual_override'),
      defaultValue: 'builtin',
    },
    sampleSize: { type: DataTypes.INTEGER, defaultValue: 0 },
    lastEstimatedAt: { type: DataTypes.DATE, allowNull: true },
  }, {
    tableName: 'depreciation_profiles',
    timestamps: true,
  });

  return DepreciationProfile;
};
