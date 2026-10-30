import User from '../models/User.js';

export async function requireVendor(req, res, next) {
  try {
    const vendor = await User.findById(req.auth.userId).select('role status');
    if (!vendor || vendor.role !== 'vendor') {
      return res.status(403).json({ message: 'Vendor access required.' });
    }
    if (vendor.status !== 'approved') {
      return res.status(403).json({ message: 'Your vendor account is not active.' });
    }
    return next();
  } catch (error) {
    console.error('Unable to verify vendor access:', error.message);
    return res.status(500).json({ message: 'Unable to verify vendor access.' });
  }
}
