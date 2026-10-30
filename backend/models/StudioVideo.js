import mongoose from 'mongoose';

const studioVideoSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, trim: true, maxlength: 2000, default: '' },
  eventDate: { type: Date },
  media: [{
    filename: { type: String, required: true },
    url: { type: String, required: true },
    originalName: { type: String, required: true, maxlength: 255 },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
  }],
  isPublished: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('StudioVideo', studioVideoSchema);
