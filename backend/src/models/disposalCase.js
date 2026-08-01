const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const DisposalCase = sequelize.define('DisposalCase', {
    id: { type: DataTypes.UUID, defaultValue: () => uuidv4(), primaryKey: true },
    companyId: { type: DataTypes.UUID, allowNull: false },
    assetId: { type: DataTypes.UUID, allowNull: false },

    // Flagged -> Manager Review -> Finance Review -> Approved -> (method) -> Disposed
    // Rejected can happen from either review stage, sending the asset back into service.
    status: {
      type: DataTypes.ENUM(
        'flagged', 'manager_review', 'finance_review', 'approved',
        'auctioning', 'selling', 'donating', 'scrapping', 'recycling',
        'disposed', 'rejected',
      ),
      defaultValue: 'flagged',
    },

    disposalMethod: {
      type: DataTypes.ENUM('auction', 'sale', 'donation', 'scrap', 'recycle'),
      allowNull: true, // chosen at the Approved stage
    },

    // What the Disposal Intelligence Engine said at the moment this case was opened
    engineRecommendation: { type: DataTypes.STRING, allowNull: true },
    engineScore: { type: DataTypes.DECIMAL(5, 2), allowNull: true },

    initiatedByUserId: { type: DataTypes.UUID, allowNull: true }, // null if system-flagged
    managerReviewedByUserId: { type: DataTypes.UUID, allowNull: true },
    managerReviewedAt: { type: DataTypes.DATE, allowNull: true },
    managerNotes: { type: DataTypes.TEXT, allowNull: true },
    financeReviewedByUserId: { type: DataTypes.UUID, allowNull: true },
    financeReviewedAt: { type: DataTypes.DATE, allowNull: true },
    financeNotes: { type: DataTypes.TEXT, allowNull: true },
    approvedByUserId: { type: DataTypes.UUID, allowNull: true },
    approvedAt: { type: DataTypes.DATE, allowNull: true },

    finalSaleAmount: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
    finalSaleCurrency: { type: DataTypes.STRING, allowNull: true },
    disposedAt: { type: DataTypes.DATE, allowNull: true },
    rejectionReason: { type: DataTypes.TEXT, allowNull: true },
  }, {
    tableName: 'disposal_cases',
    timestamps: true,
    indexes: [{ fields: ['companyId'] }, { fields: ['assetId'] }, { fields: ['status'] }],
  });

  return DisposalCase;
};
