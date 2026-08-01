const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const NewsletterSubscriber = sequelize.define('NewsletterSubscriber', {
    id: { type: DataTypes.UUID, defaultValue: () => uuidv4(), primaryKey: true },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
      set(val) { this.setDataValue('email', String(val).toLowerCase().trim()); },
    },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  }, {
    tableName: 'newsletter_subscribers',
    timestamps: true,
  });

  return NewsletterSubscriber;
};
