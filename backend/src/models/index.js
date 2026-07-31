const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const Company = require('./company')(sequelize, DataTypes);
const User = require('./user')(sequelize, DataTypes);
const SubscriptionPlan = require('./subscriptionPlan')(sequelize, DataTypes);
const Subscription = require('./subscription')(sequelize, DataTypes);
const Payment = require('./payment')(sequelize, DataTypes);
const AssetCategory = require('./assetCategory')(sequelize, DataTypes);
const CustomFieldDefinition = require('./customFieldDefinition')(sequelize, DataTypes);
const Asset = require('./asset')(sequelize, DataTypes);
const AssetCustomFieldValue = require('./assetCustomFieldValue')(sequelize, DataTypes);
const Location = require('./location')(sequelize, DataTypes);
const AssetLocationEvent = require('./assetLocationEvent')(sequelize, DataTypes);
const Assignment = require('./assignment')(sequelize, DataTypes);
const Notification = require('./notification')(sequelize, DataTypes);
const AuditLog = require('./auditLog')(sequelize, DataTypes);
const PasswordReset = require('./passwordReset')(sequelize, DataTypes);
const DepreciationProfile = require('./depreciationProfile')(sequelize, DataTypes);

// ---------------------------------------------------------------------------
// Associations
// ---------------------------------------------------------------------------

// Company <-> Users
Company.hasMany(User, { foreignKey: 'companyId', onDelete: 'CASCADE' });
User.belongsTo(Company, { foreignKey: 'companyId' });

// Company <-> Subscription (current active one) + history
Company.hasMany(Subscription, { foreignKey: 'companyId', onDelete: 'CASCADE' });
Subscription.belongsTo(Company, { foreignKey: 'companyId' });
SubscriptionPlan.hasMany(Subscription, { foreignKey: 'planId' });
Subscription.belongsTo(SubscriptionPlan, { foreignKey: 'planId' });

// Subscription <-> Payments
Subscription.hasMany(Payment, { foreignKey: 'subscriptionId', onDelete: 'CASCADE' });
Payment.belongsTo(Subscription, { foreignKey: 'subscriptionId' });
Company.hasMany(Payment, { foreignKey: 'companyId' });
Payment.belongsTo(Company, { foreignKey: 'companyId' });

// Company <-> AssetCategory (company can add custom categories on top of global ones)
Company.hasMany(AssetCategory, { foreignKey: 'companyId', onDelete: 'CASCADE' });
AssetCategory.belongsTo(Company, { foreignKey: 'companyId' });
AssetCategory.hasOne(DepreciationProfile, { foreignKey: 'categoryId', onDelete: 'CASCADE' });
DepreciationProfile.belongsTo(AssetCategory, { foreignKey: 'categoryId' });

// Company <-> CustomFieldDefinition (dynamic fields: brand, model, color, etc.)
Company.hasMany(CustomFieldDefinition, { foreignKey: 'companyId', onDelete: 'CASCADE' });
CustomFieldDefinition.belongsTo(Company, { foreignKey: 'companyId' });

// Company <-> Assets
Company.hasMany(Asset, { foreignKey: 'companyId', onDelete: 'CASCADE' });
Asset.belongsTo(Company, { foreignKey: 'companyId' });
AssetCategory.hasMany(Asset, { foreignKey: 'categoryId' });
Asset.belongsTo(AssetCategory, { foreignKey: 'categoryId' });

// Asset <-> Custom field values
Asset.hasMany(AssetCustomFieldValue, { foreignKey: 'assetId', onDelete: 'CASCADE' });
AssetCustomFieldValue.belongsTo(Asset, { foreignKey: 'assetId' });
CustomFieldDefinition.hasMany(AssetCustomFieldValue, { foreignKey: 'fieldId', onDelete: 'CASCADE' });
AssetCustomFieldValue.belongsTo(CustomFieldDefinition, { foreignKey: 'fieldId' });

// Company <-> Locations (geofenced checkpoints - warehouses, branches, sites)
Company.hasMany(Location, { foreignKey: 'companyId', onDelete: 'CASCADE' });
Location.belongsTo(Company, { foreignKey: 'companyId' });

// Asset's current location (denormalized pointer, kept in sync by scan events)
Location.hasMany(Asset, { foreignKey: 'currentLocationId' });
Asset.belongsTo(Location, { foreignKey: 'currentLocationId' });

// Asset <-> Location events (scan-based event tracking - Option B from spec)
Asset.hasMany(AssetLocationEvent, { foreignKey: 'assetId', onDelete: 'CASCADE' });
AssetLocationEvent.belongsTo(Asset, { foreignKey: 'assetId' });
Location.hasMany(AssetLocationEvent, { foreignKey: 'locationId' });
AssetLocationEvent.belongsTo(Location, { foreignKey: 'locationId' });
User.hasMany(AssetLocationEvent, { foreignKey: 'scannedByUserId' });
AssetLocationEvent.belongsTo(User, { foreignKey: 'scannedByUserId', as: 'scannedBy' });

// Asset <-> Assignments
Asset.hasMany(Assignment, { foreignKey: 'assetId', onDelete: 'CASCADE' });
Assignment.belongsTo(Asset, { foreignKey: 'assetId' });
User.hasMany(Assignment, { foreignKey: 'assignedToUserId' });
Assignment.belongsTo(User, { foreignKey: 'assignedToUserId', as: 'assignee' });
User.hasMany(Assignment, { foreignKey: 'assignedByUserId' });
Assignment.belongsTo(User, { foreignKey: 'assignedByUserId', as: 'assigner' });
Company.hasMany(Assignment, { foreignKey: 'companyId', onDelete: 'CASCADE' });
Assignment.belongsTo(Company, { foreignKey: 'companyId' });

// Notifications
User.hasMany(Notification, { foreignKey: 'userId', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'userId' });
Company.hasMany(Notification, { foreignKey: 'companyId', onDelete: 'CASCADE' });
Notification.belongsTo(Company, { foreignKey: 'companyId' });

// Audit logs
Company.hasMany(AuditLog, { foreignKey: 'companyId' });
AuditLog.belongsTo(Company, { foreignKey: 'companyId' });
User.hasMany(AuditLog, { foreignKey: 'userId' });
AuditLog.belongsTo(User, { foreignKey: 'userId' });

// Password resets
User.hasMany(PasswordReset, { foreignKey: 'userId', onDelete: 'CASCADE' });
PasswordReset.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  Company,
  User,
  SubscriptionPlan,
  Subscription,
  Payment,
  AssetCategory,
  CustomFieldDefinition,
  Asset,
  AssetCustomFieldValue,
  Location,
  AssetLocationEvent,
  Assignment,
  Notification,
  AuditLog,
  PasswordReset,
  DepreciationProfile,
};
