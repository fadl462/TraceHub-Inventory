const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const DocArticle = sequelize.define('DocArticle', {
    id: { type: DataTypes.UUID, defaultValue: () => uuidv4(), primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    // Groups articles into the sidebar's collapsible sections (e.g. "Getting
    // Started", "The Asset Intelligence Engine").
    category: { type: DataTypes.STRING, allowNull: false },
    // Order within the category's sidebar list, and within category ordering itself.
    sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
    categorySortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
    excerpt: { type: DataTypes.STRING, allowNull: true },
    bodyHtml: { type: DataTypes.TEXT, allowNull: false },
    isPublished: { type: DataTypes.BOOLEAN, defaultValue: true },
  }, {
    tableName: 'doc_articles',
    timestamps: true,
    indexes: [{ fields: ['category'] }],
  });

  return DocArticle;
};
