const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const FooterLink = sequelize.define('FooterLink', {
    id: { type: DataTypes.UUID, defaultValue: () => uuidv4(), primaryKey: true },
    label: { type: DataTypes.STRING, allowNull: false },
    url: { type: DataTypes.STRING, allowNull: false },
    group: {
      type: DataTypes.ENUM('nav', 'legal', 'social'),
      allowNull: false,
      defaultValue: 'nav',
    },
    isPublished: { type: DataTypes.BOOLEAN, defaultValue: true },
    sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
  }, {
    tableName: 'footer_links',
    timestamps: true,
  });

  return FooterLink;
};
