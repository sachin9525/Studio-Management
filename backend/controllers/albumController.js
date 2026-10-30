import mongoose from 'mongoose';
import { unlink } from 'node:fs/promises';
import { basename, join } from 'node:path';
import StudioAlbum from '../models/StudioAlbum.js';
import { albumUploadsPath } from '../middleware/uploadMedia.js';

function getAlbumValues(body = {}, partial = false) {
  const values = {};
  for (const [field, maxLength] of Object.entries({ title: 120, description: 2000 })) {
    if (partial && body[field] === undefined) continue;
    if (!partial && field === 'description' && body[field] === undefined) {
      values.description = '';
      continue;
    }
    if (typeof body[field] !== 'string') return null;
    const value = body[field].trim();
    if (value.length > maxLength || (field === 'title' && !value)) return null;
    values[field] = value;
  }
  if (body.eventDate !== undefined) {
    if (typeof body.eventDate !== 'string') return null;
    if (body.eventDate && Number.isNaN(Date.parse(body.eventDate))) return null;
    values.eventDate = body.eventDate ? new Date(body.eventDate) : null;
  }
  if (body.isPublished !== undefined) {
    if (body.isPublished === true || body.isPublished === 'true') values.isPublished = true;
    else if (body.isPublished === false || body.isPublished === 'false') values.isPublished = false;
    else return null;
  }
  if (!partial && !values.title) return null;
  return values;
}

function uploadedImages(files = []) {
  return files.map((file) => ({
    filename: file.filename,
    url: `/uploads/albums/${file.filename}`,
    originalName: file.originalname.slice(0, 255),
    mimeType: file.mimetype,
    size: file.size,
  }));
}

async function removeImageFiles(media = []) {
  await Promise.all(media.map(async ({ filename }) => {
    if (!filename || basename(filename) !== filename) return;
    try {
      await unlink(join(albumUploadsPath, filename));
    } catch (error) {
      if (error.code !== 'ENOENT') console.error('Unable to remove album image:', error.message);
    }
  }));
}

export async function getVendorAlbums(req, res) {
  try {
    const albums = await StudioAlbum.find({ vendorId: req.auth.userId }).sort({ createdAt: -1 }).lean();
    return res.json({ albums });
  } catch (error) {
    console.error('Unable to load vendor albums:', error.message);
    return res.status(500).json({ message: 'Unable to load albums.' });
  }
}

export async function createVendorAlbum(req, res) {
  const values = getAlbumValues(req.body);
  const media = uploadedImages(req.files);
  if (!values) {
    await removeImageFiles(media);
    return res.status(400).json({ message: 'Enter a valid album title and details.' });
  }
  try {
    const album = await StudioAlbum.create({ ...values, media, vendorId: req.auth.userId });
    return res.status(201).json({ album });
  } catch (error) {
    await removeImageFiles(media);
    console.error('Unable to create vendor album:', error.message);
    return res.status(500).json({ message: 'Unable to create album.' });
  }
}

export async function updateVendorAlbum(req, res) {
  const media = uploadedImages(req.files);
  if (!mongoose.isValidObjectId(req.params.id)) {
    await removeImageFiles(media);
    return res.status(400).json({ message: 'Invalid album.' });
  }
  const values = getAlbumValues(req.body, true);
  if (!values || (!Object.keys(values).length && !media.length)) {
    await removeImageFiles(media);
    return res.status(400).json({ message: 'Enter valid album details or select images to upload.' });
  }
  try {
    const update = {};
    if (Object.keys(values).length) update.$set = values;
    if (media.length) update.$push = { media: { $each: media } };
    const album = await StudioAlbum.findOneAndUpdate(
      { _id: req.params.id, vendorId: req.auth.userId },
      update,
      { new: true, runValidators: true }
    ).lean();
    if (!album) {
      await removeImageFiles(media);
      return res.status(404).json({ message: 'Album not found.' });
    }
    return res.json({ album });
  } catch (error) {
    await removeImageFiles(media);
    console.error('Unable to update vendor album:', error.message);
    return res.status(500).json({ message: 'Unable to update album.' });
  }
}

export async function deleteVendorAlbum(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid album.' });
  try {
    const album = await StudioAlbum.findOneAndDelete({ _id: req.params.id, vendorId: req.auth.userId });
    if (!album) return res.status(404).json({ message: 'Album not found.' });
    await removeImageFiles(album.media);
    return res.json({ message: 'Album deleted.' });
  } catch (error) {
    console.error('Unable to delete vendor album:', error.message);
    return res.status(500).json({ message: 'Unable to delete album.' });
  }
}

export async function deleteVendorAlbumImage(req, res) {
  if (!mongoose.isValidObjectId(req.params.id) || !mongoose.isValidObjectId(req.params.mediaId)) {
    return res.status(400).json({ message: 'Invalid album image.' });
  }
  try {
    const album = await StudioAlbum.findOne({ _id: req.params.id, vendorId: req.auth.userId });
    if (!album) return res.status(404).json({ message: 'Album not found.' });
    const image = album.media.id(req.params.mediaId);
    if (!image) return res.status(404).json({ message: 'Uploaded image not found.' });
    const { filename } = image;
    image.deleteOne();
    await album.save();
    await removeImageFiles([{ filename }]);
    return res.json({ album });
  } catch (error) {
    console.error('Unable to remove album image:', error.message);
    return res.status(500).json({ message: 'Unable to remove album image.' });
  }
}
