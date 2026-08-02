const { Op } = require('sequelize');
const {
  Asset, AssetCategory, DepreciationProfile, AssetCustomFieldValue,
  CustomFieldDefinition, Location, AssetLocationEvent, Assignment, DisposalCase,
} = require('../models');
const { estimateDepreciation } = require('../utils/depreciationEngine');
const { runFullIntelligenceAnalysis } = require('../utils/assetIntelligence');
const { getCompanyReliability } = require('../utils/learningLoop');
const { generateAssetTag, generateQrToken, generateQrDataUrl } = require('../utils/qrTag');
const { logAction } = require('../middleware/audit');

// The full Asset Intelligence Engine field set - whitelisted here once so
// createAsset/updateAsset can both accept any subset of them without
// repeating ~40 field names in two places.
const INTELLIGENCE_FIELDS = [
  'barcode', 'rfidTag', 'supplier', 'warrantyExpiry', 'expectedResidualValue', 'department',
  'country', 'building', 'room', 'gpsLat', 'gpsLng',
  'hoursUsed', 'operatingCycles', 'mileage', 'distanceTravelled', 'fuelUsage', 'energyConsumption',
  'maintenanceCount', 'repairCount', 'downtimeHours', 'idleTimeHours', 'failureCount', 'accidentCount',
  'inspectionScore', 'calibrationStatus',
  'installationCost', 'transportCost', 'insuranceCost', 'taxesCost', 'importDutiesCost',
  'maintenanceCostTotal', 'repairCostTotal', 'operationalCostTotal', 'currentMarketValue', 'currentReplacementCost',
  'humidity', 'temperature', 'dustExposure', 'outdoorExposure', 'chemicalExposure', 'corrosionRisk', 'weatherConditions',
  'userRating', 'technicianRating', 'assetReliability', 'usageIntensity', 'abuseScore', 'criticalityScore',
  'maintenanceCompliance', 'resaleDemand', 'depreciationMethod', 'unitsProductionCapacity',
  'customDepreciationFormula', 'lastMaintenanceDate', 'maintenanceIntervalDaysOverride',
];

function pickIntelligenceFields(body) {
  const picked = {};
  INTELLIGENCE_FIELDS.forEach((f) => { if (body[f] !== undefined) picked[f] = body[f] === '' ? null : body[f]; });
  return picked;
}

async function getProfileForCategory(categoryId) {
  if (!categoryId) return null;
  const profile = await DepreciationProfile.findOne({ where: { categoryId } });
  return profile ? { usefulLifeYears: profile.usefulLifeYears, scrapValuePercent: profile.scrapValuePercent } : null;
}

async function computeAndApplyDepreciation(asset) {
  const profile = await getProfileForCategory(asset.categoryId);
  const result = estimateDepreciation({
    purchasePrice: asset.purchasePrice,
    manufactureYear: asset.manufactureYear,
    purchaseDate: asset.purchaseDate,
    profile: profile || undefined,
    usefulLifeYearsOverride: asset.lifeExpectancyYearsOverride,
  });
  asset.aiUsefulLifeYears = result.usefulLifeYears;
  asset.aiScrapValue = result.scrapValue;
  asset.aiSuggestedDisposalDate = result.suggestedDisposalDate;
  asset.aiEstimatedCurrentValue = result.currentValue;
  asset.aiLastCalculatedAt = new Date();

  // Full Asset Intelligence Engine (health, failure risk, disposal readiness,
  // executive recommendation) - a superset computed alongside the simpler
  // depreciation-only result above, which many existing views still read.
  //
  // The confidence score factors in this company's AI Learning Loop history:
  // how often, historically, ignoring a disposal recommendation here has
  // actually been followed by a failure. See utils/learningLoop.js.
  const reliability = await getCompanyReliability(asset.companyId, { DisposalCase });
  const intelligence = runFullIntelligenceAnalysis(asset, profile, reliability.confidenceAdjustment);
  asset.healthScore = intelligence.health.score;
  asset.healthBreakdown = intelligence.health.breakdown;
  asset.failureProbability30d = intelligence.failure.probability30d;
  asset.failureProbability60d = intelligence.failure.probability60d;
  asset.failureProbability90d = intelligence.failure.probability90d;
  asset.failureProbability180d = intelligence.failure.probability180d;
  asset.riskScore = intelligence.failure.riskIndex;
  asset.failureReasons = intelligence.failure.reasons;
  asset.disposalReadinessScore = intelligence.disposal.score;
  asset.disposalRecommendation = intelligence.disposal.recommendation;
  asset.disposalBreakdown = intelligence.disposal.breakdown;
  asset.executiveRecommendation = intelligence.executive.headline;
  asset.executiveConfidence = intelligence.executive.confidence;
  asset.confidenceDetail = intelligence.confidence;
  asset.nextServiceDate = intelligence.maintenanceSchedule.nextServiceDate;
  asset.nextServiceReason = intelligence.maintenanceSchedule.reason;
  asset.intelligenceLastCalculatedAt = new Date();

  // If the ai_adaptive depreciation method is selected, its (potentially
  // richer, condition-aware) current value supersedes the simple estimate
  if (asset.depreciationMethod && asset.depreciationMethod !== 'straight_line') {
    asset.aiEstimatedCurrentValue = intelligence.depreciation.currentValue;
  }

  return { ...result, intelligence };
}

async function createAsset(req, res, next) {
  try {
    const {
      name, description, categoryId, serialNumber, brand, model, color,
      manufactureYear, purchaseDate, purchasePrice, currency,
      lifeExpectancyYearsOverride, freeTextLocation, currentLocationId,
      condition, customFields, photoUrl,
    } = req.body;

    if (!name) return res.status(400).json({ error: 'Asset name is required' });

    const assetTag = generateAssetTag();
    const qrToken = generateQrToken();

    const asset = await Asset.create({
      companyId: req.companyId,
      categoryId: categoryId || null,
      assetTag,
      qrToken,
      name,
      description,
      serialNumber,
      brand,
      model,
      color,
      manufactureYear,
      purchaseDate,
      purchasePrice,
      currency: currency || req.company?.currency || 'USD',
      lifeExpectancyYearsOverride,
      freeTextLocation,
      currentLocationId: currentLocationId || null,
      condition: condition || 'good',
      photoUrl,
      ...pickIntelligenceFields(req.body),
    });

    await computeAndApplyDepreciation(asset);
    await asset.save();

    if (Array.isArray(customFields)) {
      for (const cf of customFields) {
        if (!cf.fieldId) continue;
        // eslint-disable-next-line no-await-in-loop
        await AssetCustomFieldValue.create({ assetId: asset.id, fieldId: cf.fieldId, value: String(cf.value ?? '') });
      }
    }

    if (currentLocationId) {
      await AssetLocationEvent.create({
        assetId: asset.id, locationId: currentLocationId,
        scannedByUserId: req.user.id, eventType: 'manual_update', note: 'Initial registration location',
      });
    }

    await logAction(req, { action: 'asset.create', entityType: 'Asset', entityId: asset.id, after: asset.toJSON() });

    const full = await getFullAsset(asset.id);
    res.status(201).json({ asset: full });
  } catch (err) { next(err); }
}

async function getFullAsset(id) {
  return Asset.findByPk(id, {
    include: [
      { model: AssetCategory, include: [DepreciationProfile] },
      { model: AssetCustomFieldValue, include: [CustomFieldDefinition] },
      { model: Location },
      {
        model: Assignment,
        limit: 5,
        order: [['createdAt', 'DESC']],
        separate: true,
      },
    ],
  });
}

async function listAssets(req, res, next) {
  try {
    const {
      status, categoryId, search, locationId, page = 1, pageSize = 25, sortBy = 'createdAt', sortDir = 'DESC',
    } = req.query;

    const where = { isArchived: false };
    if (req.user.role === 'super_admin') {
      if (req.query.companyId) where.companyId = req.query.companyId;
    } else {
      where.companyId = req.companyId;
    }
    if (status) where.status = status;
    if (categoryId) where.categoryId = categoryId;
    if (locationId) where.currentLocationId = locationId;
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { assetTag: { [Op.like]: `%${search}%` } },
        { serialNumber: { [Op.like]: `%${search}%` } },
        { brand: { [Op.like]: `%${search}%` } },
        { model: { [Op.like]: `%${search}%` } },
      ];
    }

    const limit = Math.min(Number(pageSize) || 25, 100);
    const offset = (Math.max(Number(page), 1) - 1) * limit;

    const { rows, count } = await Asset.findAndCountAll({
      where,
      include: [{ model: AssetCategory }, { model: Location }],
      order: [[sortBy, sortDir.toUpperCase() === 'ASC' ? 'ASC' : 'DESC']],
      limit,
      offset,
    });

    res.json({ assets: rows, total: count, page: Number(page), pageSize: limit, totalPages: Math.ceil(count / limit) });
  } catch (err) { next(err); }
}

async function getAsset(req, res, next) {
  try {
    const asset = await getFullAsset(req.params.id);
    if (!asset) return res.status(404).json({ error: 'Asset not found' });
    if (asset.companyId !== req.companyId && req.user.role !== 'super_admin') {
      return res.status(403).json({ error: 'Not authorized to view this asset' });
    }
    res.json({ asset });
  } catch (err) { next(err); }
}

async function updateAsset(req, res, next) {
  try {
    const asset = await Asset.findByPk(req.params.id);
    if (!asset) return res.status(404).json({ error: 'Asset not found' });
    if (asset.companyId !== req.companyId && req.user.role !== 'super_admin') {
      return res.status(403).json({ error: 'Not authorized to modify this asset' });
    }
    const before = asset.toJSON();

    const fields = [
      'name', 'description', 'categoryId', 'serialNumber', 'brand', 'model', 'color',
      'manufactureYear', 'purchaseDate', 'purchasePrice', 'currency',
      'lifeExpectancyYearsOverride', 'freeTextLocation', 'condition', 'photoUrl', 'status',
      ...INTELLIGENCE_FIELDS,
    ];
    let depreciationInputsChanged = false;
    for (const f of fields) {
      if (req.body[f] !== undefined) {
        if (['purchasePrice', 'manufactureYear', 'purchaseDate', 'categoryId', 'lifeExpectancyYearsOverride', ...INTELLIGENCE_FIELDS].includes(f)) {
          depreciationInputsChanged = true;
        }
        asset[f] = req.body[f] === '' ? null : req.body[f];
      }
    }

    if (depreciationInputsChanged) {
      await computeAndApplyDepreciation(asset);
    }

    await asset.save();
    await logAction(req, { action: 'asset.update', entityType: 'Asset', entityId: asset.id, before, after: asset.toJSON() });

    const full = await getFullAsset(asset.id);
    res.json({ asset: full });
  } catch (err) { next(err); }
}

/** Manually re-run the AI depreciation estimate (e.g. after changing category or price) */
async function recalculateDepreciation(req, res, next) {
  try {
    const asset = await Asset.findByPk(req.params.id);
    if (!asset) return res.status(404).json({ error: 'Asset not found' });
    if (asset.companyId !== req.companyId) return res.status(403).json({ error: 'Not authorized' });
    if (!asset.purchasePrice) return res.status(400).json({ error: 'Set a purchase price before running depreciation estimate.' });

    const result = await computeAndApplyDepreciation(asset);
    await asset.save();
    res.json({ asset, depreciation: result });
  } catch (err) { next(err); }
}

async function archiveAsset(req, res, next) {
  try {
    const asset = await Asset.findByPk(req.params.id);
    if (!asset) return res.status(404).json({ error: 'Asset not found' });
    if (asset.companyId !== req.companyId) return res.status(403).json({ error: 'Not authorized' });
    asset.isArchived = true;
    asset.status = 'disposed';
    await asset.save();
    await logAction(req, { action: 'asset.archive', entityType: 'Asset', entityId: asset.id });
    res.json({ message: 'Asset archived/disposed' });
  } catch (err) { next(err); }
}

async function getAssetQr(req, res, next) {
  try {
    const asset = await Asset.findByPk(req.params.id);
    if (!asset) return res.status(404).json({ error: 'Asset not found' });
    if (asset.companyId !== req.companyId && req.user.role !== 'super_admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }
    const dataUrl = await generateQrDataUrl(asset.qrToken);
    res.json({ qrDataUrl: dataUrl, assetTag: asset.assetTag, qrToken: asset.qrToken });
  } catch (err) { next(err); }
}

/** Public-ish resolver used by the mobile scan page: token -> asset summary (auth required, tenant-checked) */
async function resolveByQrToken(req, res, next) {
  try {
    const asset = await Asset.findOne({ where: { qrToken: req.params.token } });
    if (!asset) return res.status(404).json({ error: 'This QR code does not match any known asset.' });
    if (asset.companyId !== req.companyId && req.user.role !== 'super_admin') {
      return res.status(403).json({ error: 'This asset does not belong to your organization.' });
    }
    const full = await getFullAsset(asset.id);
    res.json({ asset: full });
  } catch (err) { next(err); }
}

module.exports = {
  createAsset, listAssets, getAsset, updateAsset, recalculateDepreciation,
  archiveAsset, getAssetQr, resolveByQrToken, computeAndApplyDepreciation,
};
