const { Location, Asset, AssetLocationEvent, User } = require('../models');
const { logAction } = require('../middleware/audit');

async function listLocations(req, res, next) {
  try {
    const locations = await Location.findAll({ where: { companyId: req.companyId }, order: [['name', 'ASC']] });
    res.json({ locations });
  } catch (err) { next(err); }
}

async function createLocation(req, res, next) {
  try {
    const { name, address, latitude, longitude, geofenceRadiusMeters } = req.body;
    if (!name) return res.status(400).json({ error: 'Location name is required' });
    const location = await Location.create({
      companyId: req.companyId, name, address, latitude, longitude,
      geofenceRadiusMeters: geofenceRadiusMeters || 100,
    });
    await logAction(req, { action: 'location.create', entityType: 'Location', entityId: location.id, after: location.toJSON() });
    res.status(201).json({ location });
  } catch (err) { next(err); }
}

async function updateLocation(req, res, next) {
  try {
    const location = await Location.findByPk(req.params.id);
    if (!location || location.companyId !== req.companyId) return res.status(404).json({ error: 'Location not found' });
    const { name, address, latitude, longitude, geofenceRadiusMeters, isActive } = req.body;
    if (name !== undefined) location.name = name;
    if (address !== undefined) location.address = address;
    if (latitude !== undefined) location.latitude = latitude;
    if (longitude !== undefined) location.longitude = longitude;
    if (geofenceRadiusMeters !== undefined) location.geofenceRadiusMeters = geofenceRadiusMeters;
    if (isActive !== undefined) location.isActive = isActive;
    await location.save();
    res.json({ location });
  } catch (err) { next(err); }
}

async function deleteLocation(req, res, next) {
  try {
    const location = await Location.findByPk(req.params.id);
    if (!location || location.companyId !== req.companyId) return res.status(404).json({ error: 'Location not found' });
    await location.destroy();
    res.json({ message: 'Location deleted' });
  } catch (err) { next(err); }
}

/**
 * Core scan endpoint: staff scan an asset's QR/barcode on their phone/tablet and
 * update its location or stock status in one action - the approach agreed on
 * (Option B: event-based tracking via scans at checkpoints, no IoT hardware).
 */
async function scanAsset(req, res, next) {
  try {
    const { qrToken, locationId, eventType, note, deviceLatitude, deviceLongitude, newStatus } = req.body;
    if (!qrToken) return res.status(400).json({ error: 'qrToken is required' });

    const asset = await Asset.findOne({ where: { qrToken } });
    if (!asset) return res.status(404).json({ error: 'No asset matches this code.' });
    if (asset.companyId !== req.companyId) return res.status(403).json({ error: 'This asset belongs to a different organization.' });

    const event = await AssetLocationEvent.create({
      assetId: asset.id,
      locationId: locationId || asset.currentLocationId || null,
      scannedByUserId: req.user.id,
      eventType: eventType || 'scan_in',
      note,
      deviceLatitude,
      deviceLongitude,
    });

    if (locationId) asset.currentLocationId = locationId;
    if (newStatus) asset.status = newStatus;
    await asset.save();

    await logAction(req, { action: 'asset.scan', entityType: 'Asset', entityId: asset.id, after: { eventType, locationId } });

    res.json({ message: 'Scan recorded', asset, event });
  } catch (err) { next(err); }
}

async function getAssetLocationHistory(req, res, next) {
  try {
    const asset = await Asset.findByPk(req.params.assetId);
    if (!asset || asset.companyId !== req.companyId) return res.status(404).json({ error: 'Asset not found' });
    const events = await AssetLocationEvent.findAll({
      where: { assetId: asset.id },
      include: [{ model: Location }, { model: User, as: 'scannedBy', attributes: ['id', 'firstName', 'lastName'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json({ events });
  } catch (err) { next(err); }
}

module.exports = {
  listLocations, createLocation, updateLocation, deleteLocation,
  scanAsset, getAssetLocationHistory,
};
