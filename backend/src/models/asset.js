const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const Asset = sequelize.define('Asset', {
    id: { type: DataTypes.UUID, defaultValue: () => uuidv4(), primaryKey: true },
    companyId: { type: DataTypes.UUID, allowNull: false },
    categoryId: { type: DataTypes.UUID, allowNull: true },

    // Unique identifier for the asset - used on the printed/generated QR label
    assetTag: { type: DataTypes.STRING, allowNull: false, unique: true },
    qrToken: { type: DataTypes.STRING, allowNull: false, unique: true }, // opaque token embedded in QR code

    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    serialNumber: { type: DataTypes.STRING, allowNull: true },
    brand: { type: DataTypes.STRING, allowNull: true },
    model: { type: DataTypes.STRING, allowNull: true },
    color: { type: DataTypes.STRING, allowNull: true },

    manufactureYear: { type: DataTypes.INTEGER, allowNull: true },
    purchaseDate: { type: DataTypes.DATEONLY, allowNull: true },
    purchasePrice: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
    currency: { type: DataTypes.STRING, defaultValue: 'USD' },

    // ---- Basic Information (identification & provenance) ----
    barcode: { type: DataTypes.STRING, allowNull: true },
    rfidTag: { type: DataTypes.STRING, allowNull: true },
    supplier: { type: DataTypes.STRING, allowNull: true },
    warrantyExpiry: { type: DataTypes.DATEONLY, allowNull: true },
    expectedResidualValue: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
    department: { type: DataTypes.STRING, allowNull: true },
    country: { type: DataTypes.STRING, allowNull: true },
    building: { type: DataTypes.STRING, allowNull: true },
    room: { type: DataTypes.STRING, allowNull: true },
    gpsLat: { type: DataTypes.DECIMAL(9, 6), allowNull: true },
    gpsLng: { type: DataTypes.DECIMAL(9, 6), allowNull: true },

    // ---- Operational Information (usage that drives wear/health/failure) ----
    hoursUsed: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    operatingCycles: { type: DataTypes.INTEGER, defaultValue: 0 },
    mileage: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    distanceTravelled: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    fuelUsage: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    energyConsumption: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    maintenanceCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    repairCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    downtimeHours: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    idleTimeHours: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    failureCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    accidentCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    inspectionScore: { type: DataTypes.DECIMAL(5, 2), allowNull: true }, // 0-100, latest inspection
    calibrationStatus: { type: DataTypes.ENUM('current', 'due_soon', 'overdue', 'not_applicable'), defaultValue: 'not_applicable' },

    // ---- Financial Information (full cost of ownership, beyond purchase price) ----
    installationCost: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    transportCost: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    insuranceCost: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    taxesCost: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    importDutiesCost: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    maintenanceCostTotal: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    repairCostTotal: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    operationalCostTotal: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    currentMarketValue: { type: DataTypes.DECIMAL(12, 2), allowNull: true }, // manually-entered or comp-based estimate, distinct from the computed book value
    currentReplacementCost: { type: DataTypes.DECIMAL(12, 2), allowNull: true },

    // ---- Environmental Factors (operating conditions that accelerate wear) ----
    humidity: { type: DataTypes.DECIMAL(5, 2), allowNull: true }, // % relative humidity, typical
    temperature: { type: DataTypes.DECIMAL(5, 2), allowNull: true }, // deg C, typical operating temp
    dustExposure: { type: DataTypes.ENUM('low', 'moderate', 'high'), defaultValue: 'low' },
    outdoorExposure: { type: DataTypes.BOOLEAN, defaultValue: false },
    chemicalExposure: { type: DataTypes.ENUM('none', 'occasional', 'frequent'), defaultValue: 'none' },
    corrosionRisk: { type: DataTypes.ENUM('low', 'moderate', 'high'), defaultValue: 'low' },
    weatherConditions: { type: DataTypes.STRING, allowNull: true }, // free text, e.g. "coastal, humid"

    // ---- AI Behaviour Variables (subjective/derived inputs the engines weigh) ----
    userRating: { type: DataTypes.DECIMAL(3, 1), allowNull: true }, // 0-5, from the people using it
    technicianRating: { type: DataTypes.DECIMAL(3, 1), allowNull: true }, // 0-5, from maintenance staff
    assetReliability: { type: DataTypes.DECIMAL(5, 2), allowNull: true }, // 0-100, manually assessed or derived
    usageIntensity: { type: DataTypes.ENUM('light', 'normal', 'heavy', 'extreme'), defaultValue: 'normal' },
    abuseScore: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 }, // 0-100, higher = more evidence of misuse
    criticalityScore: { type: DataTypes.DECIMAL(5, 2), defaultValue: 50 }, // 0-100, how critical to operations
    maintenanceCompliance: { type: DataTypes.DECIMAL(5, 2), allowNull: true }, // 0-100, scheduled vs. actually performed
    resaleDemand: { type: DataTypes.ENUM('low', 'moderate', 'high'), defaultValue: 'moderate' },

    // ---- Computed by the Asset Intelligence Engine (see assetIntelligence.js) ----
    // Stored (not just computed on read) so they're queryable/sortable for dashboards
    // and comparable over time without recomputing on every request.
    healthScore: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
    healthBreakdown: { type: DataTypes.JSON, allowNull: true },
    failureProbability30d: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
    failureProbability90d: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
    failureProbability180d: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
    failureReasons: { type: DataTypes.JSON, allowNull: true },
    disposalReadinessScore: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
    disposalRecommendation: { type: DataTypes.STRING, allowNull: true }, // KEEP | REPAIR | SELL | SCRAP
    disposalBreakdown: { type: DataTypes.JSON, allowNull: true },
    executiveRecommendation: { type: DataTypes.TEXT, allowNull: true },
    executiveConfidence: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
    intelligenceLastCalculatedAt: { type: DataTypes.DATE, allowNull: true },

    depreciationMethod: {
      type: DataTypes.ENUM(
        'straight_line', 'reducing_balance', 'double_declining_balance', 'sum_of_years_digits',
        'units_of_production', 'machine_hours', 'mileage_based', 'ai_adaptive',
      ),
      defaultValue: 'straight_line',
    },
    unitsProductionCapacity: { type: DataTypes.DECIMAL(14, 2), allowNull: true }, // total expected units/hours/miles over useful life, for the usage-based methods

    // Life expectancy as provided by the user (can override the category/AI default)
    lifeExpectancyYearsOverride: { type: DataTypes.FLOAT, allowNull: true },

    // ---- AI-Driven Disposable Period Proposal (see depreciationEngine.js) ----
    aiUsefulLifeYears: { type: DataTypes.FLOAT, allowNull: true },
    aiScrapValue: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
    aiSuggestedDisposalDate: { type: DataTypes.DATEONLY, allowNull: true },
    aiEstimatedCurrentValue: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
    aiLastCalculatedAt: { type: DataTypes.DATE, allowNull: true },
    aiOverridden: { type: DataTypes.BOOLEAN, defaultValue: false },
    // ---------------------------------------------------------------------

    status: {
      type: DataTypes.ENUM('available', 'assigned', 'in_maintenance', 'disposed', 'lost', 'reserved'),
      defaultValue: 'available',
    },
    condition: {
      type: DataTypes.ENUM('new', 'good', 'fair', 'poor', 'damaged'),
      defaultValue: 'good',
    },

    currentLocationId: { type: DataTypes.UUID, allowNull: true },

    // Fallback free-text location for individuals/small setups without defined checkpoints
    freeTextLocation: { type: DataTypes.STRING, allowNull: true },

    photoUrl: { type: DataTypes.STRING, allowNull: true },
    isArchived: { type: DataTypes.BOOLEAN, defaultValue: false },
  }, {
    tableName: 'assets',
    timestamps: true,
    indexes: [
      { fields: ['companyId'] },
      { fields: ['companyId', 'status'] },
    ],
  });

  return Asset;
};
