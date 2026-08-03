const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const DocReadProgress = sequelize.define('DocReadProgress', {
    id: { type: DataTypes.UUID, defaultValue: () => uuidv4(), primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    // Tracked by slug (not article id) so progress survives even as
    // translated variants of an article get added later - reading the
    // French version of an article counts as having read it, same as any
    // other language.
    articleSlug: { type: DataTypes.STRING, allowNull: false },
    readAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, {
    tableName: 'doc_read_progress',
    timestamps: false,
    indexes: [{ unique: true, fields: ['userId', 'articleSlug'] }],
  });

  return DocReadProgress;
};
