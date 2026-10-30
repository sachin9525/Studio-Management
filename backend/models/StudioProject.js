import mongoose from 'mongoose';

const studioProjectSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  eventType: { type: String, required: true, trim: true, maxlength: 100 },
  eventDate: { type: Date },
  location: { type: String, trim: true, maxlength: 160, default: '' },
  description: { type: String, trim: true, maxlength: 2000, default: '' },
  media: [{
    filename: { type: String, required: true },
    url: { type: String, required: true },
    originalName: { type: String, required: true, maxlength: 255 },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
  }],
  isPublished: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('StudioProject', studioProjectSchema);
