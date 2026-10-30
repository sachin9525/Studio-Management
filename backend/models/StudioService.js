import mongoose from 'mongoose';

const studioServiceSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 100 },
  category: { type: String, required: true, trim: true, maxlength: 80 },
  description: { type: String, trim: true, maxlength: 1000, default: '' },
  startingPrice: { type: Number, required: true, min: 0 },
  duration: { type: String, trim: true, maxlength: 80, default: '' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('StudioService', studioServiceSchema);
