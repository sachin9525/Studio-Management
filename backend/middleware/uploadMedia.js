import { mkdirSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import multer from 'multer';

export const projectUploadsPath = fileURLToPath(new URL('../uploads/projects/', import.meta.url));
export const albumUploadsPath = fileURLToPath(new URL('../uploads/albums/', import.meta.url));
export const videoUploadsPath = fileURLToPath(new URL('../uploads/videos/', import.meta.url));
export const testimonialUploadsPath = fileURLToPath(new URL('../uploads/testimonials/', import.meta.url));

const extensions = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'video/mp4': '.mp4',
  'video/webm': '.webm',
  'video/quicktime': '.mov',
  'video/x-matroska': '.mkv',
  'video/mkv': '.mkv',
};

function createMediaReceiver(directory, acceptedTypes, limits = {}) {
  const maxFiles = limits.files ?? 20;
  const maxFileSize = limits.fileSize ?? 100 * 1024 * 1024;
  mkdirSync(directory, { recursive: true });
  const upload = multer({
    storage: multer.diskStorage({
      destination: directory,
      filename: (_req, file, callback) => callback(null, `${randomUUID()}${extensions[file.mimetype]}`),
    }),
    limits: { fileSize: maxFileSize, files: maxFiles },
    fileFilter: (_req, file, callback) => {
      if (!acceptedTypes.includes(file.mimetype)) return callback(new Error('Unsupported file type.'));
      return callback(null, true);
    },
  });

  return function receiveMedia(req, res, next) {
    upload.array('files', maxFiles)(req, res, (error) => {
      if (!error) return next();
      const message = error.code === 'LIMIT_FILE_SIZE'
        ? `Each uploaded file must be ${Math.round(maxFileSize / (1024 * 1024))} MB or smaller.`
        : error.code === 'LIMIT_FILE_COUNT'
          ? `Upload up to ${maxFiles} file${maxFiles === 1 ? '' : 's'} at a time.`
          : 'Upload supported image or video files only.';
      return res.status(400).json({ message });
    });
  };
}

export const receiveProjectMedia = createMediaReceiver(projectUploadsPath, Object.keys(extensions));
export const receiveAlbumMedia = createMediaReceiver(albumUploadsPath, Object.keys(extensions).filter((type) => type.startsWith('image/')));
export const receiveVideoMedia = createMediaReceiver(videoUploadsPath, Object.keys(extensions).filter((type) => type.startsWith('video/')));
export const receiveTestimonialMedia = createMediaReceiver(
  testimonialUploadsPath,
  Object.keys(extensions).filter((type) => type.startsWith('image/')),
  { files: 1, fileSize: 5 * 1024 * 1024 }
);
