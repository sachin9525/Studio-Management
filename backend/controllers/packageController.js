import mongoose from 'mongoose';
import StudioPackage from '../models/StudioPackage.js';

function getPackageValues(body = {}, partial = false) {
  const values = {};
  for (const [field, maxLength] of Object.entries({ name: 80, tagline: 180 })) {
    if (partial && body[field] === undefined) continue;
    if (!partial && field === 'tagline' && body[field] === undefined) {
      values.tagline = '';
      continue;
    }
    if (typeof body[field] !== 'string') return null;
    const value = body[field].trim();
    if (value.length > maxLength || (field === 'name' && !value)) return null;
    values[field] = value;
  }

  if (!partial || body.price !== undefined) {
    const price = Number(body.price);
    if (body.price === '' || !Number.isFinite(price) || price < 0) return null;
    values.price = price;
  }

  if (!partial || body.features !== undefined) {
    const features = Array.isArray(body.features)
      ? body.features
      : typeof body.features === 'string' ? body.features.split(/\r?\n/) : null;
    if (!features || features.length > 20 || features.some((feature) => typeof feature !== 'string' || feature.trim().length > 160)) return null;
    values.features = features.map((feature) => feature.trim()).filter(Boolean);
  }

  for (const field of ['isFeatured', 'isPublished']) {
    if (body[field] === undefined) continue;
    if (typeof body[field] !== 'boolean') return null;
    values[field] = body[field];
  }

  if (!partial && (!values.name || values.price === undefined)) return null;
  return values;
}

export async function getPublicPackages(_req, res) {
  try {
    const results = await StudioPackage.find({ isPublished: true })
      .sort({ isFeatured: -1, createdAt: -1 })
      .populate({ path: 'vendorId', match: { role: 'vendor', status: 'approved' }, select: 'studioName studioSlug' })
      .lean();
    const packages = results.filter((item) => item.vendorId).map((item) => ({
      ...item,
      vendorName: item.vendorId.studioName,
      vendorId: item.vendorId._id,
    }));
    return res.json({ packages });
  } catch (error) {
    console.error('Unable to load public packages:', error.message);
    return res.status(500).json({ message: 'Unable to load packages.' });
  }
}

export async function getVendorPackages(req, res) {
  try {
    const packages = await StudioPackage.find({ vendorId: req.auth.userId }).sort({ createdAt: -1 }).lean();
    return res.json({ packages });
  } catch (error) {
    console.error('Unable to load vendor packages:', error.message);
    return res.status(500).json({ message: 'Unable to load packages.' });
  }
}

export async function createVendorPackage(req, res) {
  const values = getPackageValues(req.body);
  if (!values) return res.status(400).json({ message: 'Enter a package name and a valid price and features.' });
  try {
    const studioPackage = await StudioPackage.create({ ...values, vendorId: req.auth.userId });
    return res.status(201).json({ package: studioPackage });
  } catch (error) {
    console.error('Unable to create vendor package:', error.message);
    return res.status(500).json({ message: 'Unable to create package.' });
  }
}

export async function updateVendorPackage(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid package.' });
  const values = getPackageValues(req.body, true);
  if (!values || !Object.keys(values).length) return res.status(400).json({ message: 'Enter valid package details.' });
  try {
    const studioPackage = await StudioPackage.findOneAndUpdate(
      { _id: req.params.id, vendorId: req.auth.userId },
      { $set: values },
      { new: true, runValidators: true }
    ).lean();
    if (!studioPackage) return res.status(404).json({ message: 'Package not found.' });
    return res.json({ package: studioPackage });
  } catch (error) {
    console.error('Unable to update vendor package:', error.message);
    return res.status(500).json({ message: 'Unable to update package.' });
  }
}

export async function deleteVendorPackage(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid package.' });
  try {
    const studioPackage = await StudioPackage.findOneAndDelete({ _id: req.params.id, vendorId: req.auth.userId });
    if (!studioPackage) return res.status(404).json({ message: 'Package not found.' });
    return res.json({ message: 'Package deleted.' });
  } catch (error) {
    console.error('Unable to delete vendor package:', error.message);
    return res.status(500).json({ message: 'Unable to delete package.' });
  }
}
