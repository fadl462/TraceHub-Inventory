const { v4: uuidv4 } = require('uuid');

// Singleton table (always exactly one row, id fixed to 'default') backing
// every piece of homepage/login copy the Super Admin can edit without
// touching code: hero headline, CTA text/link, hero image, login tagline,
// footer description/copyright. Testimonials, FAQs, footer links, and CMS
// pages are repeatable lists so they get their own tables instead.
module.exports = (sequelize, DataTypes) => {
  const SiteContent = sequelize.define('SiteContent', {
    id: { type: DataTypes.STRING, primaryKey: true, defaultValue: 'default' },

    // Hero
    heroEyebrow: { type: DataTypes.STRING, defaultValue: 'Asset & inventory management' },
    heroHeadline: { type: DataTypes.STRING, defaultValue: 'Know where every asset is, always.' },
    heroSubheadline: {
      type: DataTypes.TEXT,
      defaultValue: 'Register equipment in seconds, let AI propose disposal timelines, assign gear to your team, and track it all with a simple scan \u2014 no hardware required.',
    },
    heroCtaText: { type: DataTypes.STRING, defaultValue: 'Start free \u2014 10 assets, 30 days' },
    heroCtaLink: { type: DataTypes.STRING, defaultValue: '/register' },
    heroSecondaryCtaText: { type: DataTypes.STRING, defaultValue: 'See how it works' },
    heroImageUrl: { type: DataTypes.STRING, allowNull: true },

    // Login / register pages
    loginTagline: { type: DataTypes.STRING, defaultValue: 'Know where every asset is, always.' },
    loginHighlight1: { type: DataTypes.STRING, defaultValue: 'Your first 10 assets are free' },
    loginHighlight2: { type: DataTypes.STRING, defaultValue: 'No hardware, no setup fees' },

    // Footer
    footerDescription: { type: DataTypes.STRING, defaultValue: 'Precision asset tracking, built for real operations.' },
    footerCopyright: { type: DataTypes.STRING, defaultValue: 'TraceHub Inventory. All rights reserved.' },
    footerNewsletterEnabled: { type: DataTypes.BOOLEAN, defaultValue: false },
  }, {
    tableName: 'site_content',
    timestamps: true,
  });

  return SiteContent;
};
