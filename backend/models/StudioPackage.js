import mongoose from 'mongoose';

const studioPackageSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 80 },
  tagline: { type: String, trim: true, maxlength: 180, default: '' },
  price: { type: Number, required: true, min: 0 },
  features: [{ type: String, trim: true, maxlength: 160 }],
  isFeatured: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('StudioPackage', studioPackageSchema);
