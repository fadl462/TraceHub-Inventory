const { CustomFieldDefinition } = require('../models');
const { logAction } = require('../middleware/audit');

function slugifyKey(label) {
  return String(label).toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/(^_|_$)/g, '');
}

async function listFields(req, res, next) {
  try {
    const fields = await CustomFieldDefinition.findAll({
      where: { companyId: req.companyId },
      order: [['sortOrder', 'ASC'], ['createdAt', 'ASC']],
    });
    res.json({ fields });
  } catch (err) { next(err); }
}

async function createField(req, res, next) {
  try {
    const { label, fieldType, options, isRequired, appliesToCategoryId, sortOrder } = req.body;
    const key = slugifyKey(label);
    const existing = await CustomFieldDefinition.findOne({ where: { companyId: req.companyId, key } });
    if (existing) return res.status(409).json({ error: `A field with key "${key}" already exists.` });

    const field = await CustomFieldDefinition.create({
      companyId: req.companyId, label, key,
      fieldType: fieldType || 'text',
      options: options || [],
      isRequired: !!isRequired,
      appliesToCategoryId: appliesToCategoryId || null,
      sortOrder: sortOrder || 0,
    });
    await logAction(req, { action: 'customField.create', entityType: 'CustomFieldDefinition', entityId: field.id, after: field.toJSON() });
    res.status(201).json({ field });
  } catch (err) { next(err); }
}

async function updateField(req, res, next) {
  try {
    const field = await CustomFieldDefinition.findByPk(req.params.id);
    if (!field || field.companyId !== req.companyId) return res.status(404).json({ error: 'Field not found' });
    const before = field.toJSON();
    const { label, options, isRequired, appliesToCategoryId, sortOrder } = req.body;
    if (label !== undefined) field.label = label;
    if (options !== undefined) field.options = options;
    if (isRequired !== undefined) field.isRequired = isRequired;
    if (appliesToCategoryId !== undefined) field.appliesToCategoryId = appliesToCategoryId;
    if (sortOrder !== undefined) field.sortOrder = sortOrder;
    await field.save();
    await logAction(req, { action: 'customField.update', entityType: 'CustomFieldDefinition', entityId: field.id, before, after: field.toJSON() });
    res.json({ field });
  } catch (err) { next(err); }
}

async function deleteField(req, res, next) {
  try {
    const field = await CustomFieldDefinition.findByPk(req.params.id);
    if (!field || field.companyId !== req.companyId) return res.status(404).json({ error: 'Field not found' });
    await field.destroy();
    res.json({ message: 'Field deleted' });
  } catch (err) { next(err); }
}

module.exports = { listFields, createField, updateField, deleteField };
