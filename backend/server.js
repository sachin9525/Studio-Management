import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { connectDatabase } from './config/db.js';
import { seedAdmin } from './config/seedAdmin.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import packageRoutes from './routes/packageRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js';

dotenv.config({ path: fileURLToPath(new URL('./.env', import.meta.url)) });

const app = express();
const port = process.env.PORT || 5000;
const uploadsDirectory = fileURLToPath(new URL('./uploads/', import.meta.url));

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDirectory, { maxAge: '1d' }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/vendor', vendorRoutes);

connectDatabase()
  .then(() => seedAdmin())
  .then(() => {
    app.listen(port, () => console.log(`API server running on port ${port}`));
  })
  .catch((error) => {
    console.error('Unable to start API server:', error.message);
    process.exit(1);
  });
