const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const BlogComment = sequelize.define('BlogComment', {
    id: { type: DataTypes.UUID, defaultValue: () => uuidv4(), primaryKey: true },
    blogPostId: { type: DataTypes.UUID, allowNull: false },
    authorName: { type: DataTypes.STRING, allowNull: false },
    // Collected but never returned to the public API - only used if we ever
    // need to follow up on a specific comment (spam report, correction).
    authorEmail: { type: DataTypes.STRING, allowNull: true },
    body: { type: DataTypes.TEXT, allowNull: false },
    // Auto-approved for now (no moderation queue built yet) - kept as a real
    // column rather than assumed true everywhere, so a moderation pass can
    // be added later without a schema change.
    isApproved: { type: DataTypes.BOOLEAN, defaultValue: true },
  }, {
    tableName: 'blog_comments',
    timestamps: true,
    indexes: [{ fields: ['blogPostId'] }],
  });

  return BlogComment;
};
