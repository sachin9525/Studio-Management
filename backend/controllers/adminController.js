import mongoose from 'mongoose';
import Inquiry from '../models/Inquiry.js';
import User from '../models/User.js';

const vendorStatuses = ['pending', 'approved', 'suspended'];
const inquiryStatuses = ['new', 'contacted', 'booked'];

export async function getDashboard(req, res) {
  const now = new Date();
  const firstMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5, 1));

  try {
    const [[result], totalInquiries, newInquiries] = await Promise.all([
      User.aggregate([
        { $match: { role: 'vendor' } },
        {
          $facet: {
            statuses: [{ $group: { _id: '$status', count: { $sum: 1 } } }],
            registrations: [
              { $match: { createdAt: { $gte: firstMonth } } },
              {
                $group: {
                  _id: { $dateToString: { format: '%Y-%m', date: '$createdAt', timezone: 'UTC' } },
                  count: { $sum: 1 },
                },
              },
              { $sort: { _id: 1 } },
            ],
            recent: [
              { $sort: { createdAt: -1 } },
              { $limit: 5 },
              { $project: { fullName: 1, studioName: 1, city: 1, status: 1, createdAt: 1 } },
            ],
          },
        },
      ]),
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ status: 'new' }),
    ]);

    const statuses = Object.fromEntries(result.statuses.map(({ _id, count }) => [_id, count]));
    const registrationCounts = Object.fromEntries(
      result.registrations.map(({ _id, count }) => [_id, count])
    );

    const registrations = Array.from({ length: 6 }, (_, offset) => {
      const month = new Date(Date.UTC(firstMonth.getUTCFullYear(), firstMonth.getUTCMonth() + offset, 1));
      const key = `${month.getUTCFullYear()}-${String(month.getUTCMonth() + 1).padStart(2, '0')}`;
      return {
        month: month.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }),
        count: registrationCounts[key] || 0,
      };
    });

    return res.json({
      stats: {
        totalVendors: Object.values(statuses).reduce((total, count) => total + count, 0),
        activeVendors: statuses.approved || 0,
        pendingVendors: statuses.pending || 0,
        suspendedVendors: statuses.suspended || 0,
        totalInquiries,
        newInquiries,
      },
      registrations,
      recentVendors: result.recent,
    });
  } catch (error) {
    console.error('Unable to load admin dashboard:', error.message);
    return res.status(500).json({ message: 'Unable to load dashboard data.' });
  }
}

export async function getVendors(req, res) {
  const { status } = req.query;
  if (status && !vendorStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid vendor status filter.' });
  }

  const filter = { role: 'vendor', ...(status ? { status } : {}) };
  try {
    const [vendors, total] = await Promise.all([
      User.find(filter)
        .select('fullName email studioName phone city state status createdAt')
        .sort({ createdAt: -1 })
        .limit(200)
        .lean(),
      User.countDocuments(filter),
    ]);
    return res.json({ vendors, total });
  } catch (error) {
    console.error('Unable to load vendors:', error.message);
    return res.status(500).json({ message: 'Unable to load vendors.' });
  }
}

export async function updateVendorStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  if (!mongoose.isValidObjectId(id) || !vendorStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid vendor or status.' });
  }

  try {
    const vendor = await User.findOneAndUpdate(
      { _id: id, role: 'vendor' },
      { $set: { status } },
      { new: true, runValidators: true }
    ).select('fullName email studioName phone city state status createdAt');

    if (!vendor) return res.status(404).json({ message: 'Vendor not found.' });
    return res.json({ vendor });
  } catch (error) {
    console.error('Unable to update vendor:', error.message);
    return res.status(500).json({ message: 'Unable to update vendor status.' });
  }
}

export async function getInquiries(req, res) {
  const { status } = req.query;
  if (status && !inquiryStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid inquiry status filter.' });
  }

  try {
    const [inquiries, groupedCounts] = await Promise.all([
      Inquiry.find(status ? { status } : {})
        .populate('vendorId', 'studioName fullName')
        .sort({ createdAt: -1 })
        .limit(200)
        .lean(),
      Inquiry.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    ]);

    const counts = Object.fromEntries(groupedCounts.map(({ _id, count }) => [_id, count]));
    return res.json({
      inquiries,
      stats: {
        total: Object.values(counts).reduce((total, count) => total + count, 0),
        new: counts.new || 0,
        contacted: counts.contacted || 0,
        booked: counts.booked || 0,
      },
    });
  } catch (error) {
    console.error('Unable to load inquiries:', error.message);
    return res.status(500).json({ message: 'Unable to load inquiries.' });
  }
}

export async function updateInquiryStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  if (!mongoose.isValidObjectId(id) || !inquiryStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid inquiry or status.' });
  }

  try {
    const inquiry = await Inquiry.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true, runValidators: true }
    );

    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found.' });
    return res.json({ inquiry });
  } catch (error) {
    console.error('Unable to update inquiry:', error.message);
    return res.status(500).json({ message: 'Unable to update inquiry status.' });
  }
}

export async function assignInquiryVendor(req, res) {
  const { id } = req.params;
  const { vendorId } = req.body;
  if (!mongoose.isValidObjectId(id) || (vendorId && !mongoose.isValidObjectId(vendorId))) {
    return res.status(400).json({ message: 'Invalid inquiry or vendor.' });
  }

  try {
    if (vendorId) {
      const vendor = await User.findOne({ _id: vendorId, role: 'vendor', status: 'approved' }).select('_id');
      if (!vendor) return res.status(404).json({ message: 'Approved vendor not found.' });
    }
    const inquiry = await Inquiry.findByIdAndUpdate(
      id,
      { $set: { vendorId: vendorId || null } },
      { new: true, runValidators: true }
    ).populate('vendorId', 'studioName fullName');

    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found.' });
    return res.json({ inquiry });
  } catch (error) {
    console.error('Unable to assign inquiry:', error.message);
    return res.status(500).json({ message: 'Unable to assign inquiry.' });
  }
}
