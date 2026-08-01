const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const Assignment = sequelize.define('Assignment', {
    id: { type: DataTypes.UUID, defaultValue: () => uuidv4(), primaryKey: true },
    companyId: { type: DataTypes.UUID, allowNull: false },
    assetId: { type: DataTypes.UUID, allowNull: false },

    // Assigned to an internal staff user OR an external person (not a system user)
    assignedToUserId: { type: DataTypes.UUID, allowNull: true },
    externalAssigneeName: { type: DataTypes.STRING, allowNull: true },
    externalAssigneeEmail: { type: DataTypes.STRING, allowNull: true },
    externalAssigneePhone: { type: DataTypes.STRING, allowNull: true },

    assignedByUserId: { type: DataTypes.UUID, allowNull: false },

    assignedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    expectedReturnDate: { type: DataTypes.DATEONLY, allowNull: true },
    returnedAt: { type: DataTypes.DATE, allowNull: true },

    status: {
      type: DataTypes.ENUM('active', 'returned', 'overdue', 'cancelled'),
      defaultValue: 'active',
    },

    purpose: { type: DataTypes.STRING, allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true },

    // Reminder tracking flags (3-days-before + due-day, per spec) so cron doesn't double-send
    reminder3DaySentAt: { type: DataTypes.DATE, allowNull: true },
    reminderDueDaySentAt: { type: DataTypes.DATE, allowNull: true },

    // Return confirmation link for the borrower to acknowledge return (per handover notes)
    returnConfirmationToken: { type: DataTypes.STRING, allowNull: true, unique: true },
    returnConfirmedAt: { type: DataTypes.DATE, allowNull: true },

    // Hire/rental fee tracking - for assets given out on hire (typically to
    // external contacts), so admins can see at a glance whether the hire has
    // actually been paid for, not just whether it's been returned.
    hireFeeAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    hireFeeCurrency: { type: DataTypes.STRING, allowNull: true },
    hireFeePaid: { type: DataTypes.BOOLEAN, defaultValue: false },
    hireFeePaidAt: { type: DataTypes.DATE, allowNull: true },
  }, {
    tableName: 'assignments',
    timestamps: true,
    indexes: [{ fields: ['companyId', 'status'] }],
  });

  return Assignment;
};
