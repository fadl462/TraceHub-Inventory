const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const DocArticle = sequelize.define('DocArticle', {
    id: { type: DataTypes.UUID, defaultValue: () => uuidv4(), primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false },
    // Same slug reused across languages (one row per locale) - the URL
    // stays identical regardless of which language is showing.
    locale: { type: DataTypes.STRING, allowNull: false, defaultValue: 'en' },
    // Groups articles into the sidebar's collapsible sections (e.g. "Getting
    // Started", "The Asset Intelligence Engine"). Written directly in
    // whatever language this row's locale is - grouping only ever happens
    // within one locale's own result set, so there's no need for a
    // separate stable category key alongside a translated display label.
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
    indexes: [{ fields: ['category'] }, { unique: true, fields: ['slug', 'locale'] }],
  });

  return DocArticle;
};
