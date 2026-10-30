import { Router } from 'express';
import { getPublicTestimonials } from '../controllers/testimonialController.js';

const router = Router();

router.get('/', getPublicTestimonials);

export default router;
