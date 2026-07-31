const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const Faq = sequelize.define('Faq', {
    id: { type: DataTypes.UUID, defaultValue: () => uuidv4(), primaryKey: true },
    question: { type: DataTypes.STRING, allowNull: false },
    answer: { type: DataTypes.TEXT, allowNull: false },
    isPublished: { type: DataTypes.BOOLEAN, defaultValue: true },
    sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
  }, {
    tableName: 'faqs',
    timestamps: true,
  });

  return Faq;
};
