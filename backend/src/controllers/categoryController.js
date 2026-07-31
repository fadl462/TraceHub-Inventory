const { Op } = require('sequelize');
const { AssetCategory, DepreciationProfile } = require('../models');
const { logAction } = require('../middleware/audit');

async function listCategories(req, res, next) {
  try {
    const categories = await AssetCategory.findAll({
      where: { [Op.or]: [{ companyId: req.companyId }, { isGlobal: true }] },
      include: [DepreciationProfile],
      order: [['name', 'ASC']],
    });
    res.json({ categories });
  } catch (err) { next(err); }
}

async function createCategory(req, res, next) {
  try {
    const { name, description, usefulLifeYears, scrapValuePercent } = req.body;
    const category = await AssetCategory.create({ companyId: req.companyId, name, description });
    await DepreciationProfile.create({
      categoryId: category.id,
      usefulLifeYears: usefulLifeYears || 5,
      scrapValuePercent: scrapValuePercent != null ? scrapValuePercent : 10,
      source: 'manual_override',
    });
    await logAction(req, { action: 'category.create', entityType: 'AssetCategory', entityId: category.id, after: category.toJSON() });
    const withProfile = await AssetCategory.findByPk(category.id, { include: [DepreciationProfile] });
    res.status(201).json({ category: withProfile });
  } catch (err) { next(err); }
}

async function updateCategory(req, res, next) {
  try {
    const category = await AssetCategory.findByPk(req.params.id, { include: [DepreciationProfile] });
    if (!category) return res.status(404).json({ error: 'Category not found' });
    if (category.companyId && category.companyId !== req.companyId && req.user.role !== 'super_admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }
    const before = category.toJSON();
    const { name, description, usefulLifeYears, scrapValuePercent } = req.body;
    if (name !== undefined) category.name = name;
    if (description !== undefined) category.description = description;
    await category.save();

    if (category.DepreciationProfile && (usefulLifeYears !== undefined || scrapValuePercent !== undefined)) {
      if (usefulLifeYears !== undefined) category.DepreciationProfile.usefulLifeYears = usefulLifeYears;
      if (scrapValuePercent !== undefined) category.DepreciationProfile.scrapValuePercent = scrapValuePercent;
      category.DepreciationProfile.source = 'manual_override';
      await category.DepreciationProfile.save();
    }

    await logAction(req, { action: 'category.update', entityType: 'AssetCategory', entityId: category.id, before, after: category.toJSON() });
    res.json({ category });
  } catch (err) { next(err); }
}

async function deleteCategory(req, res, next) {
  try {
    const category = await AssetCategory.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    if (category.companyId !== req.companyId && req.user.role !== 'super_admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }
    await category.destroy();
    res.json({ message: 'Category deleted' });
  } catch (err) { next(err); }
}

module.exports = { listCategories, createCategory, updateCategory, deleteCategory };
