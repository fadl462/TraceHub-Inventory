const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const CmsPage = sequelize.define('CmsPage', {
    id: { type: DataTypes.UUID, defaultValue: () => uuidv4(), primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    bodyHtml: { type: DataTypes.TEXT, allowNull: true },
    showInNav: { type: DataTypes.BOOLEAN, defaultValue: false },
    showInFooter: { type: DataTypes.BOOLEAN, defaultValue: true },
    isPublished: { type: DataTypes.BOOLEAN, defaultValue: true },
    sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
  }, {
    tableName: 'cms_pages',
    timestamps: true,
  });

  return CmsPage;
};
