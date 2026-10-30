import mongoose from 'mongoose';
import Inquiry from '../models/Inquiry.js';
import StudioPackage from '../models/StudioPackage.js';
import User from '../models/User.js';

const inquiryStatuses = ['new', 'contacted', 'booked'];

export async function createInquiry(req, res) {
  const { name, email, phone, eventType, eventDate, eventLocation, budget, message, studioSlug, packageId } = req.body;
  const cleanEmail = typeof email === 'string' ? email.trim() : '';

  if (![name, phone, eventType].every((value) => typeof value === 'string' && value.trim())) {
    return res.status(400).json({ message: 'Name, phone, and event type are required.' });
  }

  if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
    return res.status(400).json({ message: 'Enter a valid email address.' });
  }

  if (eventDate && Number.isNaN(Date.parse(eventDate))) {
    return res.status(400).json({ message: 'Enter a valid event date.' });
  }

  try {
    let vendorId;
    let packageName;
    if (packageId) {
      if (!mongoose.isValidObjectId(packageId)) return res.status(400).json({ message: 'Invalid package.' });
      const studioPackage = await StudioPackage.findOne({ _id: packageId, isPublished: true })
        .populate({ path: 'vendorId', match: { role: 'vendor', status: 'approved' }, select: '_id' });
      if (!studioPackage?.vendorId) return res.status(404).json({ message: 'Package not found or no longer available.' });
      vendorId = studioPackage.vendorId._id;
      packageName = studioPackage.name;
    } else if (studioSlug) {
      const vendor = await User.findOne({ studioSlug, role: 'vendor', status: 'approved' }).select('_id');
      if (!vendor) return res.status(404).json({ message: 'Studio not found or not accepting inquiries.' });
      vendorId = vendor._id;
    }

    const inquiry = await Inquiry.create({
      name,
      email: cleanEmail,
      phone,
      eventType,
      eventDate: eventDate || undefined,
      eventLocation,
      budget,
      message,
      packageName,
      vendorId,
    });

    return res.status(201).json({ message: 'Inquiry sent successfully.', inquiryId: inquiry._id });
  } catch (error) {
    console.error('Unable to create inquiry:', error.message);
    return res.status(500).json({ message: 'Unable to send your inquiry.' });
  }
}

export async function getVendorInquiries(req, res) {
  const { status } = req.query;
  if (status && !inquiryStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid inquiry status filter.' });
  }

  try {
    const vendorId = new mongoose.Types.ObjectId(req.auth.userId);
    const [inquiries, groupedCounts] = await Promise.all([
      Inquiry.find({ vendorId, ...(status ? { status } : {}) }).sort({ createdAt: -1 }).limit(200).lean(),
      Inquiry.aggregate([
        { $match: { vendorId } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
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
    console.error('Unable to load vendor inquiries:', error.message);
    return res.status(500).json({ message: 'Unable to load inquiries.' });
  }
}

export async function updateVendorInquiryStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  if (!mongoose.isValidObjectId(id) || !inquiryStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid inquiry or status.' });
  }

  try {
    const inquiry = await Inquiry.findOneAndUpdate(
      { _id: id, vendorId: req.auth.userId },
      { $set: { status } },
      { new: true, runValidators: true }
    ).lean();
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found.' });
    return res.json({ inquiry });
  } catch (error) {
    console.error('Unable to update vendor inquiry:', error.message);
    return res.status(500).json({ message: 'Unable to update inquiry status.' });
  }
}
