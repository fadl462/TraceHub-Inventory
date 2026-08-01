const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const {
  Company, User, Subscription, SubscriptionPlan, AssetCategory, DepreciationProfile,
  Asset, Location, AssetLocationEvent, Assignment,
} = require('../models');
const { estimateDepreciation } = require('../utils/depreciationEngine');
const { generateAssetTag, generateQrToken } = require('../utils/qrTag');

const DEMO_PASSWORD = 'Demo1234!';

const DEMO_ASSETS = [
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
];

async function seedDemoCompany() {
  const [company] = await Company.findOrCreate({
    where: { slug: 'demo-logistics' },
    defaults: {
      name: 'Demo Logistics Ltd', slug: 'demo-logistics', type: 'company',
      industry: 'Logistics & Distribution', currency: 'USD', status: 'active',
    },
  });

  const roles = [
    { role: 'company_admin', firstName: 'Ama', lastName: 'Boateng', email: 'admin@demo-logistics.test' },
    { role: 'manager', firstName: 'Kwesi', lastName: 'Owusu', email: 'manager@demo-logistics.test' },
    { role: 'staff', firstName: 'Efua', lastName: 'Mensah', email: 'staff@demo-logistics.test' },
  ];

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);
  const users = {};
  for (const r of roles) {
    const [user] = await User.findOrCreate({
      where: { email: r.email },
      defaults: { companyId: company.id, firstName: r.firstName, lastName: r.lastName, role: r.role, passwordHash, isEmailVerified: true },
    });
    users[r.role] = user;
    console.log(`  ${r.role}: ${r.email} / ${DEMO_PASSWORD}`);
  }

  // Give the demo company an active Pro subscription so billing/reports look real
  const proPlan = await SubscriptionPlan.findOne({ where: { code: 'pro' } });
  if (proPlan) {
    await Subscription.findOrCreate({
      where: { companyId: company.id },
      defaults: {
        companyId: company.id, planId: proPlan.id, billingCycle: 'monthly',
        status: 'active', currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
  }

  // Locations
  const locationNames = ['Accra HQ Warehouse', 'Kumasi Branch', 'Takoradi Depot'];
  const locations = {};
  for (const name of locationNames) {
    const [loc] = await Location.findOrCreate({ where: { companyId: company.id, name }, defaults: { companyId: company.id, name } });
    locations[name] = loc;
  }

  // Assets, each with a real depreciation calc, spread across locations
  const locKeys = Object.keys(locations);
  const createdAssets = [];
  for (let i = 0; i < DEMO_ASSETS.length; i += 1) {
    const spec = DEMO_ASSETS[i];
    const existing = await Asset.findOne({ where: { companyId: company.id, name: spec.name } });
    if (existing) { createdAssets.push(existing); continue; }

    const category = await AssetCategory.findOne({ where: { name: spec.category, isGlobal: true } });
    const profile = category ? await DepreciationProfile.findOne({ where: { categoryId: category.id } }) : null;

    const asset = await Asset.create({
      companyId: company.id,
      categoryId: category?.id || null,
      assetTag: generateAssetTag(),
      qrToken: generateQrToken(),
      name: spec.name,
      brand: spec.brand,
      model: spec.model,
      color: spec.color,
      manufactureYear: spec.year,
      purchasePrice: spec.price,
      currency: 'USD',
      currentLocationId: locations[locKeys[i % locKeys.length]].id,
      status: 'available',
      condition: 'good',
    });

    if (profile) {
      const result = estimateDepreciation({
        purchasePrice: spec.price, manufactureYear: spec.year,
        profile: { usefulLifeYears: profile.usefulLifeYears, scrapValuePercent: profile.scrapValuePercent },
      });
      asset.aiUsefulLifeYears = result.usefulLifeYears;
      asset.aiScrapValue = result.scrapValue;
      asset.aiSuggestedDisposalDate = result.suggestedDisposalDate;
      asset.aiEstimatedCurrentValue = result.currentValue;
      asset.aiLastCalculatedAt = new Date();
      await asset.save();
    }

    await AssetLocationEvent.create({
      assetId: asset.id, locationId: asset.currentLocationId,
      scannedByUserId: users.staff.id, eventType: 'manual_update', note: 'Initial registration',
    });

    createdAssets.push(asset);
  }

  // A handful of assignments: one active (on time), one overdue, one returned
  const assignmentSpecs = [
    { assetIdx: 0, assignedTo: 'staff', status: 'active', daysFromNow: 10 },
    { assetIdx: 3, assignedTo: 'manager', status: 'overdue', daysFromNow: -4 },
    { assetIdx: 8, assignedTo: 'staff', status: 'returned', daysFromNow: -20 },
  ];

  for (const spec of assignmentSpecs) {
    const asset = createdAssets[spec.assetIdx];
    if (!asset) continue;
    const existing = await Assignment.findOne({ where: { companyId: company.id, assetId: asset.id } });
    if (existing) continue;

    const expectedReturnDate = new Date(Date.now() + spec.daysFromNow * 24 * 60 * 60 * 1000);
    const assignment = await Assignment.create({
      companyId: company.id,
      assetId: asset.id,
      assignedToUserId: users[spec.assignedTo].id,
      assignedByUserId: users.company_admin.id,
      expectedReturnDate,
      purpose: 'Field operations',
      status: spec.status,
      returnedAt: spec.status === 'returned' ? new Date() : null,
    });

    if (spec.status !== 'returned') {
      asset.status = 'assigned';
      await asset.save();
    }
  }

  return { company, users };
}

module.exports = { seedDemoCompany, DEMO_PASSWORD };
