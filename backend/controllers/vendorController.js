import mongoose from 'mongoose';
import { unlink } from 'node:fs/promises';
import { basename, join } from 'node:path';
import Inquiry from '../models/Inquiry.js';
import StudioAlbum from '../models/StudioAlbum.js';
import StudioProject from '../models/StudioProject.js';
import StudioPackage from '../models/StudioPackage.js';
import StudioService from '../models/StudioService.js';
import StudioVideo from '../models/StudioVideo.js';
import User from '../models/User.js';
import { projectUploadsPath } from '../middleware/uploadMedia.js';

const profileFields = {
  fullName: 120,
  studioName: 120,
  phone: 40,
  address: 200,
  city: 100,
  state: 100,
};

const serviceFields = ['name', 'category', 'description', 'startingPrice', 'duration'];
const serviceFieldLimits = { name: 100, category: 80, description: 1000, duration: 80 };
const projectFields = ['title', 'eventType', 'eventDate', 'location', 'description'];
const projectFieldLimits = { title: 120, eventType: 100, location: 160, description: 2000 };

function getServiceValues(body, partial = false) {
  body ||= {};
  const values = {};
  for (const field of serviceFields) {
    if (partial && body[field] === undefined) continue;
    if (field === 'startingPrice') {
      if (body[field] === '' || body[field] === null || body[field] === undefined) return null;
      const price = Number(body[field]);
      if (!Number.isFinite(price) || price < 0) return null;
      values[field] = price;
      continue;
    }
    if (typeof body[field] !== 'string') return null;
    values[field] = body[field].trim();
    if (values[field].length > serviceFieldLimits[field]) return null;
    if (['name', 'category'].includes(field) && !values[field]) return null;
  }
  if (body.isActive !== undefined) {
    if (typeof body.isActive !== 'boolean') return null;
    values.isActive = body.isActive;
  }
  if (!partial && (!values.name || !values.category)) return null;
  if (partial && Object.keys(values).length === 0) return null;
  return values;
}

function getProjectValues(body, partial = false) {
  body ||= {};
  const values = {};
  for (const field of projectFields) {
    if (partial && body[field] === undefined) continue;
    if (typeof body[field] !== 'string') return null;
    const value = body[field].trim();
    if (value.length > (projectFieldLimits[field] || Infinity)) return null;
    if (['title', 'eventType'].includes(field) && !value) return null;
    if (field === 'eventDate') {
      if (value && Number.isNaN(Date.parse(value))) return null;
      values[field] = value ? new Date(value) : null;
    } else {
      values[field] = value;
    }
  }
  if (body.isPublished !== undefined) {
    if (body.isPublished === true || body.isPublished === 'true') values.isPublished = true;
    else if (body.isPublished === false || body.isPublished === 'false') values.isPublished = false;
    else return null;
  }
  if (!partial && (!values.title || !values.eventType)) return null;
  if (partial && Object.keys(values).length === 0) return null;
  return values;
}

function uploadedMedia(files = []) {
  return files.map((file) => ({
    filename: file.filename,
    url: `/uploads/projects/${file.filename}`,
    originalName: file.originalname.slice(0, 255),
    mimeType: file.mimetype,
    size: file.size,
  }));
}

async function removeMediaFiles(media = []) {
  await Promise.all(media.map(async ({ filename }) => {
    if (!filename || basename(filename) !== filename) return;
    try {
      await unlink(join(projectUploadsPath, filename));
    } catch (error) {
      if (error.code !== 'ENOENT') console.error('Unable to remove uploaded media:', error.message);
    }
  }));
}

export async function getVendorProjects(req, res) {
  try {
    const projects = await StudioProject.find({ vendorId: req.auth.userId }).sort({ createdAt: -1 }).lean();
    return res.json({ projects });
  } catch (error) {
    console.error('Unable to load vendor projects:', error.message);
    return res.status(500).json({ message: 'Unable to load projects.' });
  }
}

export async function createVendorProject(req, res) {
  const values = getProjectValues(req.body);
  const media = uploadedMedia(req.files);
  if (!values) {
    await removeMediaFiles(media);
    return res.status(400).json({ message: 'Enter a title and event type with valid project details.' });
  }
  try {
    const project = await StudioProject.create({ ...values, media, vendorId: req.auth.userId });
    return res.status(201).json({ project });
  } catch (error) {
    await removeMediaFiles(media);
    console.error('Unable to create vendor project:', error.message);
    return res.status(500).json({ message: 'Unable to create project.' });
  }
}

export async function updateVendorProject(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid project.' });
  const values = getProjectValues(req.body, true);
  const media = uploadedMedia(req.files);
  if (!values) {
    await removeMediaFiles(media);
    return res.status(400).json({ message: 'Enter valid project details.' });
  }
  try {
    const update = { $set: values };
    if (media.length) update.$push = { media: { $each: media } };
    const project = await StudioProject.findOneAndUpdate(
      { _id: req.params.id, vendorId: req.auth.userId },
      update,
      { new: true, runValidators: true }
    ).lean();
    if (!project) {
      await removeMediaFiles(media);
      return res.status(404).json({ message: 'Project not found.' });
    }
    return res.json({ project });
  } catch (error) {
    await removeMediaFiles(media);
    console.error('Unable to update vendor project:', error.message);
    return res.status(500).json({ message: 'Unable to update project.' });
  }
}

export async function deleteVendorProject(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid project.' });
  try {
    const project = await StudioProject.findOneAndDelete({ _id: req.params.id, vendorId: req.auth.userId });
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    await removeMediaFiles(project.media);
    return res.json({ message: 'Project deleted.' });
  } catch (error) {
    console.error('Unable to delete vendor project:', error.message);
    return res.status(500).json({ message: 'Unable to delete project.' });
  }
}

export async function deleteVendorProjectMedia(req, res) {
  if (!mongoose.isValidObjectId(req.params.id) || !mongoose.isValidObjectId(req.params.mediaId)) {
    return res.status(400).json({ message: 'Invalid project media.' });
  }
  try {
    const project = await StudioProject.findOne({ _id: req.params.id, vendorId: req.auth.userId });
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    const media = project.media.id(req.params.mediaId);
    if (!media) return res.status(404).json({ message: 'Uploaded file not found.' });
    const { filename } = media;
    media.deleteOne();
    await project.save();
    await removeMediaFiles([{ filename }]);
    return res.json({ project });
  } catch (error) {
    console.error('Unable to remove project media:', error.message);
    return res.status(500).json({ message: 'Unable to remove uploaded file.' });
  }
}

export async function getVendorServices(req, res) {
  try {
    const services = await StudioService.find({ vendorId: req.auth.userId }).sort({ createdAt: -1 }).lean();
    return res.json({ services });
  } catch (error) {
    console.error('Unable to load vendor services:', error.message);
    return res.status(500).json({ message: 'Unable to load services.' });
  }
}

export async function createVendorService(req, res) {
  const values = getServiceValues(req.body);
  if (!values) return res.status(400).json({ message: 'Enter a name, category, and valid starting price.' });

  try {
    const service = await StudioService.create({ ...values, vendorId: req.auth.userId });
    return res.status(201).json({ service });
  } catch (error) {
    console.error('Unable to create vendor service:', error.message);
    return res.status(500).json({ message: 'Unable to create service.' });
  }
}

export async function updateVendorService(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid service.' });
  const values = getServiceValues(req.body, true);
  if (!values) return res.status(400).json({ message: 'Enter valid service details.' });

  try {
    const service = await StudioService.findOneAndUpdate(
      { _id: req.params.id, vendorId: req.auth.userId },
      { $set: values },
      { new: true, runValidators: true }
    ).lean();
    if (!service) return res.status(404).json({ message: 'Service not found.' });
    return res.json({ service });
  } catch (error) {
    console.error('Unable to update vendor service:', error.message);
    return res.status(500).json({ message: 'Unable to update service.' });
  }
}

export async function deleteVendorService(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid service.' });
  try {
    const service = await StudioService.findOneAndDelete({ _id: req.params.id, vendorId: req.auth.userId });
    if (!service) return res.status(404).json({ message: 'Service not found.' });
    return res.json({ message: 'Service deleted.' });
  } catch (error) {
    console.error('Unable to delete vendor service:', error.message);
    return res.status(500).json({ message: 'Unable to delete service.' });
  }
}

export async function getVendorProfile(req, res) {
  try {
    const profile = await User.findById(req.auth.userId)
      .select('fullName email studioName studioSlug phone address city state status createdAt')
      .lean();
    if (!profile) return res.status(404).json({ message: 'Vendor profile not found.' });
    return res.json({ profile });
  } catch (error) {
    console.error('Unable to load vendor profile:', error.message);
    return res.status(500).json({ message: 'Unable to load studio profile.' });
  }
}

export async function updateVendorProfile(req, res) {
  const body = req.body || {};
  const values = {};
  for (const [field, maxLength] of Object.entries(profileFields)) {
    const value = body[field];
    if (typeof value !== 'string' || value.length > maxLength) {
      return res.status(400).json({ message: `Enter a valid ${field}.` });
    }
    values[field] = value.trim();
  }
  if (!values.fullName || !values.studioName || !values.phone) {
    return res.status(400).json({ message: 'Owner name, studio name, and phone are required.' });
  }

  try {
    const profile = await User.findOneAndUpdate(
      { _id: req.auth.userId, role: 'vendor', status: 'approved' },
      { $set: values },
      { new: true, runValidators: true }
    ).select('fullName email studioName studioSlug phone address city state status createdAt');
    if (!profile) return res.status(404).json({ message: 'Vendor profile not found.' });
    return res.json({ profile });
  } catch (error) {
    console.error('Unable to update vendor profile:', error.message);
    return res.status(500).json({ message: 'Unable to save studio profile.' });
  }
}

export async function getVendorDashboard(req, res) {
  const vendorId = req.auth.userId;
  const ownerId = new mongoose.Types.ObjectId(vendorId);
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  try {
    const [vendor, groupedCounts, bookedThisMonth, recentInquiries, totalProjects, publishedProjects, activeServices, totalAlbums, publishedAlbums, videoCounts, totalPackages, publishedPackages] = await Promise.all([
      User.findById(vendorId).select('fullName email studioName studioSlug phone address city state status createdAt').lean(),
      Inquiry.aggregate([
        { $match: { vendorId: ownerId } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Inquiry.countDocuments({
        vendorId,
        status: 'booked',
        eventDate: { $gte: monthStart, $lt: nextMonth },
      }),
      Inquiry.find({ vendorId })
        .select('name eventType eventDate status createdAt')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      StudioProject.countDocuments({ vendorId }),
      StudioProject.countDocuments({ vendorId, isPublished: true }),
      StudioService.countDocuments({ vendorId, isActive: true }),
      StudioAlbum.countDocuments({ vendorId }),
      StudioAlbum.countDocuments({ vendorId, isPublished: true }),
      StudioVideo.aggregate([
        { $match: { vendorId: ownerId } },
        { $unwind: '$media' },
        { $count: 'total' },
      ]),
      StudioPackage.countDocuments({ vendorId }),
      StudioPackage.countDocuments({ vendorId, isPublished: true }),
    ]);

    if (!vendor) return res.status(404).json({ message: 'Vendor account not found.' });
    const counts = Object.fromEntries(groupedCounts.map(({ _id, count }) => [_id, count]));
    return res.json({
      vendor,
      stats: {
        totalInquiries: Object.values(counts).reduce((total, count) => total + count, 0),
        newInquiries: counts.new || 0,
        contactedInquiries: counts.contacted || 0,
        bookedThisMonth,
        totalProjects,
        publishedProjects,
        activeServices,
        totalAlbums,
        publishedAlbums,
        totalVideos: videoCounts[0]?.total || 0,
        totalPackages,
        publishedPackages,
      },
      recentInquiries,
    });
  } catch (error) {
    console.error('Unable to load vendor dashboard:', error.message);
    return res.status(500).json({ message: 'Unable to load dashboard data.' });
  }
}
