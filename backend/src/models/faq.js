const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const Faq = sequelize.define('Faq', {
    id: { type: DataTypes.UUID, defaultValue: () => uuidv4(), primaryKey: true },
    // Ties the same conceptual FAQ together across languages (no natural
    // slug exists here) - deliberately nullable with no unique constraint,
    // same reasoning as Testimonial.groupKey: existing legacy FAQs (from
    // before this field existed) shouldn't be forced into any particular
    // value during migration.
    groupKey: { type: DataTypes.STRING, allowNull: true },
    locale: { type: DataTypes.STRING, allowNull: false, defaultValue: 'en' },
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
