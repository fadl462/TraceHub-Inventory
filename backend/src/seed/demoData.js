const bcrypt = require('bcryptjs');
const {
  Company, User, Subscription, SubscriptionPlan, AssetCategory, DepreciationProfile,
  Asset, Location, AssetLocationEvent, Assignment, Payment, AuditLog,
} = require('../models');
const { estimateDepreciation } = require('../utils/depreciationEngine');
const { runFullIntelligenceAnalysis } = require('../utils/assetIntelligence');
const { generateAssetTag, generateQrToken } = require('../utils/qrTag');

const DEMO_PASSWORD = 'Demo1234!';

const COMPANIES = [
  {
    slug: 'demo-logistics',
    name: 'Demo Logistics Ltd',
    industry: 'Logistics & Distribution',
    plan: 'pro',
    users: [
      { role: 'company_admin', firstName: 'Ama', lastName: 'Boateng', email: 'admin@demo-logistics.test' },
      { role: 'manager', firstName: 'Kwesi', lastName: 'Owusu', email: 'manager@demo-logistics.test' },
      { role: 'staff', firstName: 'Efua', lastName: 'Mensah', email: 'staff@demo-logistics.test' },
      { role: 'company_admin', firstName: 'Sady', lastName: 'Essel', email: 'sady@demo-logistics.test' },
    ],
    locations: ['Accra HQ Warehouse', 'Kumasi Branch', 'Takoradi Depot'],
    assets: [
      { name: 'Dell Latitude 5420', category: 'Laptops & Computers', brand: 'Dell', model: 'Latitude 5420', color: 'Silver', price: 950, year: 2023 },
      { name: 'MacBook Pro 14"', category: 'Laptops & Computers', brand: 'Apple', model: 'MacBook Pro 14', color: 'Space Grey', price: 2200, year: 2024 },
      { name: 'HP LaserJet Pro', category: 'Office Equipment (Printers, Scanners)', brand: 'HP', model: 'LaserJet Pro M404', color: 'White', price: 320, year: 2022 },
      { name: 'Toyota Hilux \u2014 GR-4471-24', category: 'Vehicles', brand: 'Toyota', model: 'Hilux', color: 'White', price: 38000, year: 2024 },
      { name: 'Generator Unit 04', category: 'Generators', brand: 'Mikano', model: 'M55', color: 'Yellow', price: 4200, year: 2021 },
      { name: 'Forklift 02', category: 'Forklifts & Material Handling', brand: 'Toyota', model: '8FGU25', color: 'Orange', price: 26500, year: 2020 },
      { name: 'Cisco Switch 24-port', category: 'Networking & IT Infrastructure', brand: 'Cisco', model: 'Catalyst 2960', color: 'Black', price: 680, year: 2022 },
      { name: 'Office Desk (Executive)', category: 'Office Furniture', brand: 'IKEA', model: 'Bekant', color: 'Oak', price: 240, year: 2021 },
      { name: 'Samsung Tablet', category: 'Mobile Phones & Tablets', brand: 'Samsung', model: 'Galaxy Tab S8', color: 'Graphite', price: 480, year: 2023 },
      { name: 'Power Drill Set', category: 'Tools & Hand Equipment', brand: 'DeWalt', model: 'DCD778', color: 'Yellow', price: 145, year: 2022 },
    ],
    assignments: [
      { assetIdx: 0, assignedTo: 'staff', status: 'active', daysFromNow: 10 },
      { assetIdx: 3, assignedTo: 'manager', status: 'overdue', daysFromNow: -4 },
      { assetIdx: 8, assignedTo: 'staff', status: 'returned', daysFromNow: -20 },
    ],
  },
  {
    slug: 'northline-it',
    name: 'Northline IT Solutions',
    industry: 'Information Technology',
    plan: 'basic',
    users: [
      { role: 'company_admin', firstName: 'Yaw', lastName: 'Asante', email: 'admin@northline-it.test' },
      { role: 'manager', firstName: 'Abena', lastName: 'Darko', email: 'manager@northline-it.test' },
      { role: 'staff', firstName: 'Kojo', lastName: 'Appiah', email: 'staff@northline-it.test' },
      { role: 'company_admin', firstName: 'Sady', lastName: 'Essel', email: 'sady@northline-it.test' },
    ],
    locations: ['Head Office \u2014 Airport City', 'Client Site \u2014 East Legon'],
    assets: [
      { name: 'Dell PowerEdge R740 Server', category: 'Networking & IT Infrastructure', brand: 'Dell', model: 'PowerEdge R740', color: 'Black', price: 6800, year: 2022 },
      { name: 'Lenovo ThinkPad X1', category: 'Laptops & Computers', brand: 'Lenovo', model: 'ThinkPad X1 Carbon', color: 'Black', price: 1750, year: 2024 },
      { name: 'Lenovo ThinkPad X1 (2)', category: 'Laptops & Computers', brand: 'Lenovo', model: 'ThinkPad X1 Carbon', color: 'Black', price: 1750, year: 2023 },
      { name: 'Ubiquiti UniFi Switch Pro', category: 'Networking & IT Infrastructure', brand: 'Ubiquiti', model: 'USW-Pro-48', color: 'White', price: 999, year: 2023 },
      { name: 'APC Smart-UPS 3000VA', category: 'Networking & IT Infrastructure', brand: 'APC', model: 'SRT3000XLI', color: 'Black', price: 2100, year: 2021 },
      { name: 'iPad Pro 12.9"', category: 'Mobile Phones & Tablets', brand: 'Apple', model: 'iPad Pro', color: 'Space Grey', price: 1400, year: 2024 },
      { name: 'Epson Projector EB-2250U', category: 'Office Equipment (Printers, Scanners)', brand: 'Epson', model: 'EB-2250U', color: 'White', price: 1350, year: 2022 },
      { name: 'Conference Room Table', category: 'Office Furniture', brand: 'Herman Miller', model: 'Layout Studio', color: 'Walnut', price: 2200, year: 2020 },
    ],
    assignments: [
      { assetIdx: 1, assignedTo: 'staff', status: 'active', daysFromNow: 14 },
      { assetIdx: 5, assignedTo: 'manager', status: 'active', daysFromNow: 5 },
    ],
  },
  {
    slug: 'accra-field-services',
    name: 'Accra Field Services Co.',
    industry: 'Field Services & Equipment Hire',
    plan: 'enterprise',
    users: [
      { role: 'company_admin', firstName: 'Nana', lastName: 'Adjei', email: 'admin@accra-field.test' },
      { role: 'manager', firstName: 'Akosua', lastName: 'Frimpong', email: 'manager@accra-field.test' },
      { role: 'staff', firstName: 'Kwame', lastName: 'Nkrumah-Boateng', email: 'staff@accra-field.test' },
      { role: 'company_admin', firstName: 'Sady', lastName: 'Essel', email: 'sady@accra-field.test' },
    ],
    locations: ['Tema Equipment Yard', 'Spintex Workshop'],
    assets: [
      { name: 'Caterpillar Mini Excavator', category: 'Industrial Machinery', brand: 'Caterpillar', model: '301.7 CR', price: 42000, year: 2021 },
      { name: 'Generator Unit \u2014 60kVA', category: 'Generators', brand: 'Cummins', model: 'C60D5', color: 'Red', price: 15500, year: 2022 },
      { name: 'Generator Unit \u2014 20kVA', category: 'Generators', brand: 'Mikano', model: 'M22', color: 'Yellow', price: 5200, year: 2023 },
      { name: 'Concrete Mixer', category: 'Industrial Machinery', brand: 'Altrad Belle', model: 'Minimix 150', color: 'Orange', price: 1100, year: 2022 },
      { name: 'Angle Grinder Set', category: 'Tools & Hand Equipment', brand: 'Makita', model: 'GA9020', color: 'Teal', price: 220, year: 2023 },
      { name: 'Toyota Land Cruiser \u2014 GT-2201-23', category: 'Vehicles', brand: 'Toyota', model: 'Land Cruiser', color: 'White', price: 52000, year: 2023 },
      { name: 'Scaffolding Set (10m)', category: 'Tools & Hand Equipment', brand: 'Generic', model: 'Standard Frame', price: 1800, year: 2021 },
    ],
    assignments: [
      // The showcase "hire" example: an external customer renting a generator,
      // fee tracked, not yet paid - demonstrates the hire-fee feature end to end.
      {
        assetIdx: 1, external: { name: 'Kofi Mensah (Mensah Events)', email: 'kofi@mensahevents.test', phone: '+233 24 555 0199' },
        status: 'active', daysFromNow: 6, purpose: 'Event power supply hire',
        hireFeeAmount: 450, hireFeeCurrency: 'USD', hireFeePaid: false,
      },
      {
        assetIdx: 4, assignedTo: 'staff', status: 'active', daysFromNow: 3, purpose: 'On-site repair job',
      },
    ],
  },
];

async function seedOneCompany(spec) {
  const [company] = await Company.findOrCreate({
    where: { slug: spec.slug },
    defaults: {
      name: spec.name, slug: spec.slug, type: 'company',
      industry: spec.industry, currency: 'USD', status: 'active',
    },
  });

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);
  const users = {};
  for (const r of spec.users) {
    const [user] = await User.findOrCreate({
      where: { email: r.email },
      defaults: { companyId: company.id, firstName: r.firstName, lastName: r.lastName, role: r.role, passwordHash, isEmailVerified: true },
    });
    users[r.role] = users[r.role] || user; // first user per role stays "primary" for assignedBy/audit-log references below
    console.log(`  ${r.role}: ${r.email} / ${DEMO_PASSWORD}`);
  }

  const plan = await SubscriptionPlan.findOne({ where: { code: spec.plan } });
  let subscription = null;
  if (plan) {
    [subscription] = await Subscription.findOrCreate({
      where: { companyId: company.id },
      defaults: {
        companyId: company.id, planId: plan.id, billingCycle: 'monthly',
        status: 'active', currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
  }

  const locations = {};
  for (const name of spec.locations) {
    const [loc] = await Location.findOrCreate({ where: { companyId: company.id, name }, defaults: { companyId: company.id, name } });
    locations[name] = loc;
  }
  const locKeys = Object.keys(locations);

  const createdAssets = [];
  for (let i = 0; i < spec.assets.length; i += 1) {
    const a = spec.assets[i];
    const existing = await Asset.findOne({ where: { companyId: company.id, name: a.name } });
    if (existing) { createdAssets.push(existing); continue; }

    const category = await AssetCategory.findOne({ where: { name: a.category, isGlobal: true } });
    const profile = category ? await DepreciationProfile.findOne({ where: { categoryId: category.id } }) : null;

    // Vary the operational/financial/environmental profile deterministically
    // by position so the demo shows a real spread - not every asset healthy,
    // not every asset critical.
    const wearTier = i % 4; // 0=excellent, 1=healthy, 2=needs attention, 3=at risk
    const wearProfiles = [
      { usageIntensity: 'light', repairCount: 0, failureCount: 0, maintenanceCount: 3, maintenanceCompliance: 96, assetReliability: 94, inspectionScore: 92, corrosionRisk: 'low', dustExposure: 'low', criticalityScore: 55, resaleDemand: 'high' },
      { usageIntensity: 'normal', repairCount: 1, failureCount: 0, maintenanceCount: 2, maintenanceCompliance: 80, assetReliability: 82, inspectionScore: 78, corrosionRisk: 'low', dustExposure: 'moderate', criticalityScore: 60, resaleDemand: 'moderate' },
      { usageIntensity: 'heavy', repairCount: 3, failureCount: 1, maintenanceCount: 1, maintenanceCompliance: 55, assetReliability: 62, inspectionScore: 58, corrosionRisk: 'moderate', dustExposure: 'moderate', criticalityScore: 65, resaleDemand: 'moderate' },
      { usageIntensity: 'extreme', repairCount: 5, failureCount: 2, maintenanceCount: 1, maintenanceCompliance: 35, assetReliability: 45, inspectionScore: 40, corrosionRisk: 'high', dustExposure: 'high', criticalityScore: 70, resaleDemand: 'low' },
    ];
    const wear = wearProfiles[wearTier];
    const maintenanceCostTotal = Math.round(a.price * (0.02 + wearTier * 0.04));
    const repairCostTotal = Math.round(a.price * (wearTier * 0.06));

    const asset = await Asset.create({
      companyId: company.id,
      categoryId: category?.id || null,
      assetTag: generateAssetTag(),
      qrToken: generateQrToken(),
      name: a.name,
      brand: a.brand,
      model: a.model,
      color: a.color || null,
      manufactureYear: a.year,
      purchasePrice: a.price,
      currency: 'USD',
      currentLocationId: locations[locKeys[i % locKeys.length]].id,
      status: 'available',
      condition: 'good',
      hoursUsed: wearTier * 2000 + 300,
      maintenanceCostTotal,
      repairCostTotal,
      currentReplacementCost: Math.round(a.price * 1.08),
      currentMarketValue: Math.round(a.price * (0.75 - wearTier * 0.15)),
      ...wear,
    });

    if (profile) {
      const result = estimateDepreciation({
        purchasePrice: a.price, manufactureYear: a.year,
        profile: { usefulLifeYears: profile.usefulLifeYears, scrapValuePercent: profile.scrapValuePercent },
      });
      asset.aiUsefulLifeYears = result.usefulLifeYears;
      asset.aiScrapValue = result.scrapValue;
      asset.aiSuggestedDisposalDate = result.suggestedDisposalDate;
      asset.aiEstimatedCurrentValue = result.currentValue;
      asset.aiLastCalculatedAt = new Date();
    }

    // Run the full Asset Intelligence Engine so seeded assets show real,
    // varied health/failure/disposal/executive scores - not nulls.
    const intelligence = runFullIntelligenceAnalysis(asset, profile ? { usefulLifeYears: profile.usefulLifeYears, scrapValuePercent: profile.scrapValuePercent } : null);
    asset.healthScore = intelligence.health.score;
    asset.healthBreakdown = intelligence.health.breakdown;
    asset.failureProbability30d = intelligence.failure.probability30d;
    asset.failureProbability60d = intelligence.failure.probability60d;
    asset.failureProbability90d = intelligence.failure.probability90d;
    asset.failureProbability180d = intelligence.failure.probability180d;
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
    await asset.save();

    await AssetLocationEvent.create({
      assetId: asset.id, locationId: asset.currentLocationId,
      scannedByUserId: users.staff.id, eventType: 'manual_update', note: 'Initial registration',
    });

    createdAssets.push(asset);
  }

  for (const s of spec.assignments) {
    const asset = createdAssets[s.assetIdx];
    if (!asset) continue;
    const existing = await Assignment.findOne({ where: { companyId: company.id, assetId: asset.id } });
    if (existing) continue;

    const expectedReturnDate = new Date(Date.now() + s.daysFromNow * 24 * 60 * 60 * 1000);
    await Assignment.create({
      companyId: company.id,
      assetId: asset.id,
      assignedToUserId: s.assignedTo ? users[s.assignedTo].id : null,
      externalAssigneeName: s.external?.name || null,
      externalAssigneeEmail: s.external?.email || null,
      externalAssigneePhone: s.external?.phone || null,
      assignedByUserId: users.company_admin.id,
      expectedReturnDate,
      purpose: s.purpose || 'Field operations',
      status: s.status,
      returnedAt: s.status === 'returned' ? new Date() : null,
      hireFeeAmount: s.hireFeeAmount || null,
      hireFeeCurrency: s.hireFeeAmount ? (s.hireFeeCurrency || 'USD') : null,
      hireFeePaid: !!s.hireFeePaid,
      hireFeePaidAt: s.hireFeePaid ? new Date() : null,
    });

    if (s.status !== 'returned') {
      asset.status = 'assigned';
      await asset.save();
    }
  }

  // Realistic payment history - 3 months of successful renewals at the
  // plan's real monthly price, so revenue totals/trends/by-plan chart show
  // actual numbers instead of zero. One company also gets a failed payment
  // so the system-health "failed payments" stat has something to show.
  if (plan) {
    const existingPayments = await Payment.count({ where: { companyId: company.id } });
    if (existingPayments === 0) {
      for (let m = 2; m >= 0; m -= 1) {
        const paidAt = new Date();
        paidAt.setMonth(paidAt.getMonth() - m);
        // eslint-disable-next-line no-await-in-loop
        await Payment.create({
          companyId: company.id,
          subscriptionId: subscription?.id || null,
          provider: 'flutterwave',
          txRef: `SEED-${company.slug}-${m}-${Date.now()}`,
          amount: plan.priceMonthly,
          currency: 'USD',
          status: 'successful',
          paymentMethod: 'card',
          invoiceNumber: `INV-${company.slug}-${m}-${Date.now()}`,
          paidAt,
        });
      }
      if (spec.slug === 'accra-field-services') {
        const failedAt = new Date();
        failedAt.setDate(failedAt.getDate() - 5);
        await Payment.create({
          companyId: company.id,
          subscriptionId: subscription?.id || null,
          provider: 'flutterwave',
          txRef: `SEED-${company.slug}-failed-${Date.now()}`,
          amount: plan.priceMonthly,
          currency: 'USD',
          status: 'failed',
          createdAt: failedAt,
          updatedAt: failedAt,
        });
      }
    }
  }

  // A handful of realistic recent activity entries so the global audit log
  // (and its CSV export) has something real to show rather than "no
  // activity yet".
  const existingLogs = await AuditLog.count({ where: { companyId: company.id } });
  if (existingLogs === 0) {
    const activityTemplates = [
      { action: 'asset.create', entityType: 'Asset', userKey: 'staff', daysAgo: 1 },
      { action: 'assignment.create', entityType: 'Assignment', userKey: 'company_admin', daysAgo: 2 },
      { action: 'asset.update', entityType: 'Asset', userKey: 'manager', daysAgo: 4 },
      { action: 'user.create', entityType: 'User', userKey: 'company_admin', daysAgo: 8 },
    ];
    for (const t of activityTemplates) {
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - t.daysAgo);
      // eslint-disable-next-line no-await-in-loop
      await AuditLog.create({
        companyId: company.id,
        userId: users[t.userKey]?.id || users.company_admin.id,
        action: t.action,
        entityType: t.entityType,
        createdAt,
      });
    }
  }

  return { company, users };
}

async function seedDemoCompany() {
  const results = [];
  for (const spec of COMPANIES) {
    console.log(`  Company: ${spec.name}`);
    // eslint-disable-next-line no-await-in-loop
    const result = await seedOneCompany(spec);
    results.push(result);
  }
  return results;
}

module.exports = { seedDemoCompany, DEMO_PASSWORD };
