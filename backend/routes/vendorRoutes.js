import { Router } from 'express';
import {
  createVendorAlbum,
  deleteVendorAlbum,
  deleteVendorAlbumImage,
  getVendorAlbums,
  updateVendorAlbum,
} from '../controllers/albumController.js';
import {
  createVendorVideo,
  deleteVendorVideo,
  deleteVendorVideoFile,
  getVendorVideos,
  updateVendorVideo,
} from '../controllers/videoController.js';
import {
  createVendorPackage,
  deleteVendorPackage,
  getVendorPackages,
  updateVendorPackage,
} from '../controllers/packageController.js';
import {
  createVendorProject,
  createVendorService,
  deleteVendorProject,
  deleteVendorProjectMedia,
  deleteVendorService,
  getVendorDashboard,
  getVendorProfile,
  getVendorProjects,
  getVendorServices,
  updateVendorProfile,
  updateVendorProject,
  updateVendorService,
} from '../controllers/vendorController.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireVendor } from '../middleware/requireVendor.js';
import { receiveAlbumMedia, receiveProjectMedia, receiveTestimonialMedia, receiveVideoMedia } from '../middleware/uploadMedia.js';
import { getVendorInquiries, updateVendorInquiryStatus } from '../controllers/inquiryController.js';
import {
  createVendorTestimonial,
  deleteVendorTestimonial,
  getVendorTestimonials,
  updateVendorTestimonial,
} from '../controllers/testimonialController.js';

const router = Router();

router.use(requireAuth, requireVendor);
router.get('/dashboard', getVendorDashboard);
router.get('/inquiries', getVendorInquiries);
router.patch('/inquiries/:id/status', updateVendorInquiryStatus);
router.get('/testimonials', getVendorTestimonials);
router.post('/testimonials', receiveTestimonialMedia, createVendorTestimonial);
router.patch('/testimonials/:id', receiveTestimonialMedia, updateVendorTestimonial);
router.delete('/testimonials/:id', deleteVendorTestimonial);
router.get('/profile', getVendorProfile);
router.put('/profile', updateVendorProfile);
router.get('/services', getVendorServices);
router.post('/services', createVendorService);
router.patch('/services/:id', updateVendorService);
router.delete('/services/:id', deleteVendorService);
router.get('/albums', getVendorAlbums);
router.post('/albums', receiveAlbumMedia, createVendorAlbum);
router.patch('/albums/:id', receiveAlbumMedia, updateVendorAlbum);
router.delete('/albums/:id', deleteVendorAlbum);
router.delete('/albums/:id/media/:mediaId', deleteVendorAlbumImage);
router.get('/videos', getVendorVideos);
router.post('/videos', receiveVideoMedia, createVendorVideo);
router.patch('/videos/:id', receiveVideoMedia, updateVendorVideo);
router.delete('/videos/:id', deleteVendorVideo);
router.delete('/videos/:id/media/:mediaId', deleteVendorVideoFile);
router.get('/packages', getVendorPackages);
router.post('/packages', createVendorPackage);
router.patch('/packages/:id', updateVendorPackage);
router.delete('/packages/:id', deleteVendorPackage);
router.get('/projects', getVendorProjects);
router.post('/projects', receiveProjectMedia, createVendorProject);
router.patch('/projects/:id', receiveProjectMedia, updateVendorProject);
router.delete('/projects/:id', deleteVendorProject);
router.delete('/projects/:id/media/:mediaId', deleteVendorProjectMedia);

export default router;
