const { v4: uuidv4 } = require('uuid');

// Lets each company define their own asset attributes (Brand, Model, Colour, etc.)
// as requested: "Brands, Colors, Models, those will be dynamic - each company can
// create their own desired fields."
module.exports = (sequelize, DataTypes) => {
  const CustomFieldDefinition = sequelize.define('CustomFieldDefinition', {
    id: { type: DataTypes.UUID, defaultValue: () => uuidv4(), primaryKey: true },
    companyId: { type: DataTypes.UUID, allowNull: false },
    label: { type: DataTypes.STRING, allowNull: false }, // "Brand", "Model", "Colour"
    key: { type: DataTypes.STRING, allowNull: false }, // slugified, unique per company
    fieldType: {
      type: DataTypes.ENUM('text', 'number', 'date', 'select', 'boolean'),
      defaultValue: 'text',
    },
    options: {
      // For 'select' type: JSON array of allowed values, editable by company admin
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '[]',
      get() {
        const raw = this.getDataValue('options');
        try { return raw ? JSON.parse(raw) : []; } catch { return []; }
      },
      set(val) { this.setDataValue('options', JSON.stringify(val || [])); },
    },
    isRequired: { type: DataTypes.BOOLEAN, defaultValue: false },
    appliesToCategoryId: { type: DataTypes.UUID, allowNull: true }, // null = applies to all assets
    sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
  }, {
    tableName: 'custom_field_definitions',
    timestamps: true,
    indexes: [{ unique: true, fields: ['companyId', 'key'] }],
  });

  return CustomFieldDefinition;
};
