import mongoose from 'mongoose';
import { unlink } from 'node:fs/promises';
import { basename, join } from 'node:path';
import StudioVideo from '../models/StudioVideo.js';
import { videoUploadsPath } from '../middleware/uploadMedia.js';

function getVideoValues(body = {}, partial = false) {
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

function uploadedVideos(files = []) {
  return files.map((file) => ({
    filename: file.filename,
    url: `/uploads/videos/${file.filename}`,
    originalName: file.originalname.slice(0, 255),
    mimeType: file.mimetype,
    size: file.size,
  }));
}

async function removeVideoFiles(media = []) {
  await Promise.all(media.map(async ({ filename }) => {
    if (!filename || basename(filename) !== filename) return;
    try {
      await unlink(join(videoUploadsPath, filename));
    } catch (error) {
      if (error.code !== 'ENOENT') console.error('Unable to remove video file:', error.message);
    }
  }));
}

export async function getVendorVideos(req, res) {
  try {
    const videos = await StudioVideo.find({ vendorId: req.auth.userId }).sort({ createdAt: -1 }).lean();
    return res.json({ videos });
  } catch (error) {
    console.error('Unable to load vendor videos:', error.message);
    return res.status(500).json({ message: 'Unable to load videos.' });
  }
}

export async function createVendorVideo(req, res) {
  const values = getVideoValues(req.body);
  const media = uploadedVideos(req.files);
  if (!values || !media.length) {
    await removeVideoFiles(media);
    return res.status(400).json({ message: 'Enter a valid title and upload at least one video.' });
  }
  try {
    const video = await StudioVideo.create({ ...values, media, vendorId: req.auth.userId });
    return res.status(201).json({ video });
  } catch (error) {
    await removeVideoFiles(media);
    console.error('Unable to create vendor video:', error.message);
    return res.status(500).json({ message: 'Unable to create video entry.' });
  }
}

export async function updateVendorVideo(req, res) {
  const media = uploadedVideos(req.files);
  if (!mongoose.isValidObjectId(req.params.id)) {
    await removeVideoFiles(media);
    return res.status(400).json({ message: 'Invalid video entry.' });
  }
  const values = getVideoValues(req.body, true);
  if (!values || (!Object.keys(values).length && !media.length)) {
    await removeVideoFiles(media);
    return res.status(400).json({ message: 'Enter valid video details or select videos to upload.' });
  }
  try {
    const update = {};
    if (Object.keys(values).length) update.$set = values;
    if (media.length) update.$push = { media: { $each: media } };
    const video = await StudioVideo.findOneAndUpdate(
      { _id: req.params.id, vendorId: req.auth.userId },
      update,
      { new: true, runValidators: true }
    ).lean();
    if (!video) {
      await removeVideoFiles(media);
      return res.status(404).json({ message: 'Video entry not found.' });
    }
    return res.json({ video });
  } catch (error) {
    await removeVideoFiles(media);
    console.error('Unable to update vendor video:', error.message);
    return res.status(500).json({ message: 'Unable to update video entry.' });
  }
}

export async function deleteVendorVideo(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid video entry.' });
  try {
    const video = await StudioVideo.findOneAndDelete({ _id: req.params.id, vendorId: req.auth.userId });
    if (!video) return res.status(404).json({ message: 'Video entry not found.' });
    await removeVideoFiles(video.media);
    return res.json({ message: 'Video entry deleted.' });
  } catch (error) {
    console.error('Unable to delete vendor video:', error.message);
    return res.status(500).json({ message: 'Unable to delete video entry.' });
  }
}

export async function deleteVendorVideoFile(req, res) {
  if (!mongoose.isValidObjectId(req.params.id) || !mongoose.isValidObjectId(req.params.mediaId)) {
    return res.status(400).json({ message: 'Invalid video file.' });
  }
  try {
    const video = await StudioVideo.findOne({ _id: req.params.id, vendorId: req.auth.userId });
    if (!video) return res.status(404).json({ message: 'Video entry not found.' });
    const file = video.media.id(req.params.mediaId);
    if (!file) return res.status(404).json({ message: 'Uploaded video not found.' });
    const { filename } = file;
    video.media.pull(file._id);
    if (!video.media.length) {
      await video.deleteOne();
      await removeVideoFiles([{ filename }]);
      return res.json({ message: 'Video entry deleted.' });
    }
    await video.save();
    await removeVideoFiles([{ filename }]);
    return res.json({ video });
  } catch (error) {
    console.error('Unable to remove uploaded video:', error.message);
    return res.status(500).json({ message: 'Unable to remove uploaded video.' });
  }
}
