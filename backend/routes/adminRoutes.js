import { Router } from 'express';
import {
  getDashboard,
  getInquiries,
  getVendors,
  assignInquiryVendor,
  updateInquiryStatus,
  updateVendorStatus,
} from '../controllers/adminController.js';
import { getAdminSettings, updateSettings } from '../controllers/settingsController.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = Router();

router.use(requireAuth, requireAdmin);
router.get('/dashboard', getDashboard);
router.get('/vendors', getVendors);
router.patch('/vendors/:id/status', updateVendorStatus);
router.get('/inquiries', getInquiries);
router.patch('/inquiries/:id/status', updateInquiryStatus);
router.patch('/inquiries/:id/vendor', assignInquiryVendor);
router.get('/settings', getAdminSettings);
router.put('/settings', updateSettings);

export default router;
