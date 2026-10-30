import mongoose from 'mongoose';

const studioTestimonialSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  name: { type: String, required: true, trim: true, maxlength: 120 },
  role: { type: String, required: true, trim: true, maxlength: 120 },
  review: { type: String, required: true, trim: true, maxlength: 2000 },
  rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
  image: {
    filename: String,
    url: String,
    originalName: String,
    mimeType: String,
    size: Number,
  },
  imageUrl: { type: String, trim: true, default: '' },
  isPublished: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('StudioTestimonial', studioTestimonialSchema);
