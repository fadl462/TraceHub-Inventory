const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const Testimonial = sequelize.define('Testimonial', {
    id: { type: DataTypes.UUID, defaultValue: () => uuidv4(), primaryKey: true },
    quote: { type: DataTypes.TEXT, allowNull: false },
    authorName: { type: DataTypes.STRING, allowNull: false },
    authorRole: { type: DataTypes.STRING, allowNull: true },
    companyName: { type: DataTypes.STRING, allowNull: true },
    avatarUrl: { type: DataTypes.STRING, allowNull: true },
    isPublished: { type: DataTypes.BOOLEAN, defaultValue: true },
    sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
  }, {
    tableName: 'testimonials',
    timestamps: true,
  });

  return Testimonial;
};
