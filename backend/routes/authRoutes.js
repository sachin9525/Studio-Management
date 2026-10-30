import { Router } from 'express';
import { getCurrentUser, login, registerVendor } from '../controllers/authController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

router.post('/login', login);
router.post('/register/vendor', registerVendor);
router.get('/me', requireAuth, getCurrentUser);

export default router;
