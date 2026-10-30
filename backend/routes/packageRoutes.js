import { Router } from 'express';
import { getPublicPackages } from '../controllers/packageController.js';

const router = Router();

router.get('/', getPublicPackages);

export default router;
