const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const FeatureRequestVote = sequelize.define('FeatureRequestVote', {
    id: { type: DataTypes.UUID, defaultValue: () => uuidv4(), primaryKey: true },
    featureRequestId: { type: DataTypes.UUID, allowNull: false },
    userId: { type: DataTypes.UUID, allowNull: false },
  }, {
    tableName: 'feature_request_votes',
    timestamps: true,
    updatedAt: false,
    indexes: [{ unique: true, fields: ['featureRequestId', 'userId'] }],
  });

  return FeatureRequestVote;
};
