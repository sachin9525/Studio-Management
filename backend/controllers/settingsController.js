import PlatformSettings, { defaultPlatformSettings } from '../models/PlatformSettings.js';

const settingsFields = Object.keys(defaultPlatformSettings);

async function readSettings() {
  const saved = await PlatformSettings.findById('global').lean();
  return { ...defaultPlatformSettings, ...(saved || {}) };
}

export async function getPublicSettings(req, res) {
  try {
    return res.json(await readSettings());
  } catch (error) {
    console.error('Unable to load public settings:', error.message);
    return res.status(500).json({ message: 'Unable to load studio contact details.' });
  }
}

export async function getAdminSettings(req, res) {
  try {
    return res.json(await readSettings());
  } catch (error) {
    console.error('Unable to load admin settings:', error.message);
    return res.status(500).json({ message: 'Unable to load settings.' });
  }
}

export async function updateSettings(req, res) {
  const values = {};
  for (const field of settingsFields) {
    const value = req.body[field];
    if (typeof value !== 'string') {
      return res.status(400).json({ message: `Invalid ${field}.` });
    }
    values[field] = value.trim();
  }

  if (!values.brandName || !values.phone || !/^\S+@\S+\.\S+$/.test(values.contactEmail)) {
    return res.status(400).json({ message: 'Studio name, a valid contact email, and phone are required.' });
  }
  if (values.bookingEmail && !/^\S+@\S+\.\S+$/.test(values.bookingEmail)) {
    return res.status(400).json({ message: 'Enter a valid booking email.' });
  }

  try {
    const settings = await PlatformSettings.findByIdAndUpdate(
      'global',
      { $set: values },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    ).lean();
    return res.json({ settings });
  } catch (error) {
    console.error('Unable to save admin settings:', error.message);
    return res.status(500).json({ message: 'Unable to save settings.' });
  }
}
