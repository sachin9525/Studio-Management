import mongoose from 'mongoose';
import { unlink } from 'node:fs/promises';
import { basename, join } from 'node:path';
import StudioTestimonial from '../models/StudioTestimonial.js';
import User from '../models/User.js';
import { testimonialUploadsPath } from '../middleware/uploadMedia.js';

function getTestimonialValues(body = {}, partial = false) {
  const values = {};
  for (const [field, maxLength] of Object.entries({ name: 120, role: 120, review: 2000 })) {
    if (partial && body[field] === undefined) continue;
    if (typeof body[field] !== 'string') return null;
    values[field] = body[field].trim();
    if (values[field].length > maxLength || (['name', 'role', 'review'].includes(field) && !values[field])) return null;
  }

  if (!partial || body.rating !== undefined) {
    const rating = Number(body.rating ?? 5);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) return null;
    values.rating = rating;
  }
  if (body.isPublished !== undefined) {
    if (body.isPublished === true || body.isPublished === 'true') values.isPublished = true;
    else if (body.isPublished === false || body.isPublished === 'false') values.isPublished = false;
    else return null;
  } else if (!partial) {
    values.isPublished = false;
  }

  if (!partial && (!values.name || !values.role || !values.review)) return null;
  return values;
}

function uploadedImage(file) {
  return file ? {
    filename: file.filename,
    url: `/uploads/testimonials/${file.filename}`,
    originalName: file.originalname.slice(0, 255),
    mimeType: file.mimetype,
    size: file.size,
  } : undefined;
}

async function removeImage(image) {
  if (!image?.filename || basename(image.filename) !== image.filename) return;
  try {
    await unlink(join(testimonialUploadsPath, image.filename));
  } catch (error) {
    if (error.code !== 'ENOENT') console.error('Unable to remove testimonial image:', error.message);
  }
}

async function removeUploadedFiles(files = []) {
  await Promise.all(files.map((file) => removeImage({ filename: file.filename })));
}

export async function getPublicTestimonials(_req, res) {
  try {
    const approvedVendorIds = await User.find({ role: 'vendor', status: 'approved' }).distinct('_id');
    const testimonials = await StudioTestimonial.find({
      isPublished: true,
      $or: [{ vendorId: null }, { vendorId: { $in: approvedVendorIds } }],
    }).populate('vendorId', 'studioName').sort({ createdAt: -1 }).lean();
    return res.json({ testimonials: testimonials.map((item) => ({
      ...item,
      imageUrl: item.image?.url || item.imageUrl || '',
      vendorName: item.vendorId?.studioName || '',
    })) });
  } catch (error) {
    console.error('Unable to load testimonials:', error.message);
    return res.status(500).json({ message: 'Unable to load testimonials.' });
  }
}

export async function getVendorTestimonials(req, res) {
  try {
    const testimonials = await StudioTestimonial.find({ vendorId: req.auth.userId }).sort({ createdAt: -1 }).lean();
    return res.json({ testimonials });
  } catch (error) {
    console.error('Unable to load vendor testimonials:', error.message);
    return res.status(500).json({ message: 'Unable to load testimonials.' });
  }
}

export async function createVendorTestimonial(req, res) {
  const values = getTestimonialValues(req.body);
  const image = uploadedImage(req.files?.[0]);
  if (!values) {
    await removeUploadedFiles(req.files);
    return res.status(400).json({ message: 'Enter a client name, event, review, and rating from 1 to 5.' });
  }
  try {
    const testimonial = await StudioTestimonial.create({ ...values, image, vendorId: req.auth.userId });
    return res.status(201).json({ testimonial });
  } catch (error) {
    await removeUploadedFiles(req.files);
    console.error('Unable to create vendor testimonial:', error.message);
    return res.status(500).json({ message: 'Unable to create testimonial.' });
  }
}

export async function updateVendorTestimonial(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    await removeUploadedFiles(req.files);
    return res.status(400).json({ message: 'Invalid testimonial.' });
  }
  const values = getTestimonialValues(req.body, true);
  const image = uploadedImage(req.files?.[0]);
  if (!values || (!Object.keys(values).length && !image)) {
    await removeUploadedFiles(req.files);
    return res.status(400).json({ message: 'Enter valid testimonial details.' });
  }

  try {
    const previous = image ? await StudioTestimonial.findOne({ _id: req.params.id, vendorId: req.auth.userId }).select('image').lean() : null;
    const update = { $set: values };
    if (image) update.$set.image = image;
    const testimonial = await StudioTestimonial.findOneAndUpdate(
      { _id: req.params.id, vendorId: req.auth.userId },
      update,
      { new: true, runValidators: true }
    ).lean();
    if (!testimonial) {
      await removeUploadedFiles(req.files);
      return res.status(404).json({ message: 'Testimonial not found.' });
    }
    if (image) await removeImage(previous?.image);
    return res.json({ testimonial });
  } catch (error) {
    await removeUploadedFiles(req.files);
    console.error('Unable to update vendor testimonial:', error.message);
    return res.status(500).json({ message: 'Unable to update testimonial.' });
  }
}

export async function deleteVendorTestimonial(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid testimonial.' });
  try {
    const testimonial = await StudioTestimonial.findOneAndDelete({ _id: req.params.id, vendorId: req.auth.userId });
    if (!testimonial) return res.status(404).json({ message: 'Testimonial not found.' });
    await removeImage(testimonial.image);
    return res.json({ message: 'Testimonial deleted.' });
  } catch (error) {
    console.error('Unable to delete vendor testimonial:', error.message);
    return res.status(500).json({ message: 'Unable to delete testimonial.' });
  }
}
