const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const FeatureRequest = sequelize.define('FeatureRequest', {
    id: { type: DataTypes.UUID, defaultValue: () => uuidv4(), primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    // Deliberately NOT scoped to a single company - the whole point of this
    // board is measuring genuine cross-customer demand ("how many different
    // organizations independently want this"), not one company's internal
    // wishlist. Every authenticated user, regardless of company or role,
    // can see and vote on every request.
    createdByUserId: { type: DataTypes.UUID, allowNull: true },
    createdByCompanyId: { type: DataTypes.UUID, allowNull: true }, // for context/attribution only, not an access-control scope
    status: {
      type: DataTypes.ENUM('open', 'planned', 'in_progress', 'completed', 'declined'),
      defaultValue: 'open',
    },
    // Set by a Super Admin when declining or completing, so the requester(s) know why/what happened.
    statusNote: { type: DataTypes.TEXT, allowNull: true },
  }, {
    tableName: 'feature_requests',
    timestamps: true,
  });

  return FeatureRequest;
};
