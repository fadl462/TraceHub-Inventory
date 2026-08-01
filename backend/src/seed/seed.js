require('dotenv').config();
const bcrypt = require('bcryptjs');
const {
  sequelize, User, SubscriptionPlan, AssetCategory, DepreciationProfile,
  SiteContent, Testimonial, Faq, FooterLink, PlatformSettings,
} = require('../models');
const depreciationProfiles = require('./depreciationProfiles');
const plans = require('./plans');
const testimonials = require('./testimonials');
const faqs = require('./faqs');
const footerLinks = require('./footerLinks');
const { seedDemoCompany, DEMO_PASSWORD } = require('./demoData');

async function seed() {
  console.log('Connecting to database and syncing schema...');
  await sequelize.sync({ alter: true });

  console.log('Seeding subscription plans...');
  for (const p of plans) {
    const [plan, created] = await SubscriptionPlan.findOrCreate({ where: { code: p.code }, defaults: p });
    console.log(`  ${created ? 'created' : 'exists'}: ${plan.name}`);
  }

  console.log('Seeding global asset categories + depreciation profiles...');
  for (const dp of depreciationProfiles) {
    const [category, created] = await AssetCategory.findOrCreate({
      where: { name: dp.name, companyId: null },
      defaults: { name: dp.name, companyId: null, isGlobal: true },
    });
    await DepreciationProfile.findOrCreate({
      where: { categoryId: category.id },
      defaults: {
        categoryId: category.id,
        usefulLifeYears: dp.usefulLifeYears,
        scrapValuePercent: dp.scrapValuePercent,
        source: 'builtin',
      },
    });
    console.log(`  ${created ? 'created' : 'exists'}: ${category.name}`);
  }

  console.log('Seeding default site content (hero/login/footer copy)...');
  await SiteContent.findOrCreate({ where: { id: 'default' } });

  console.log('Seeding default platform settings (branding placeholder)...');
  await PlatformSettings.findOrCreate({ where: { id: 'default' } });

  console.log('Seeding sample testimonials...');
  for (const t of testimonials) {
    const [, created] = await Testimonial.findOrCreate({ where: { authorName: t.authorName, quote: t.quote }, defaults: t });
    console.log(`  ${created ? 'created' : 'exists'}: ${t.authorName}`);
  }

  console.log('Seeding sample FAQs...');
  for (const f of faqs) {
    const [, created] = await Faq.findOrCreate({ where: { question: f.question }, defaults: f });
    console.log(`  ${created ? 'created' : 'exists'}: ${f.question}`);
  }

  console.log('Seeding default footer links...');
  for (const l of footerLinks) {
    const [, created] = await FooterLink.findOrCreate({ where: { label: l.label, group: l.group }, defaults: l });
    console.log(`  ${created ? 'created' : 'exists'}: ${l.label}`);
  }

  console.log('Ensuring Super Admin account exists...');
  const superAdminEmail = (process.env.SUPER_ADMIN_EMAIL || 'admin@tracehub.app').toLowerCase();
  const existing = await User.findOne({ where: { email: superAdminEmail } });
  if (!existing) {
    const passwordHash = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD || 'ChangeMe123!', 12);
    await User.create({
      companyId: null,
      firstName: 'TraceHub',
      lastName: 'Admin',
      email: superAdminEmail,
      passwordHash,
      role: 'super_admin',
      isEmailVerified: true,
    });
    console.log(`  Super Admin created: ${superAdminEmail} (password from .env - change it after first login!)`);
  } else {
    console.log('  Super Admin already exists.');
  }

  console.log('Seeding demo company with sample assets, users, and assignments...');
  await seedDemoCompany();
  console.log(`  Demo accounts all use password: ${DEMO_PASSWORD}`);

  console.log('\nSeeding complete.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
