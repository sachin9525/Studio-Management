import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    phone: { type: String, required: true, trim: true, maxlength: 40 },
    eventType: { type: String, required: true, trim: true, maxlength: 120 },
    eventDate: { type: Date },
    eventLocation: { type: String, trim: true, maxlength: 200 },
    budget: { type: String, trim: true, maxlength: 80 },
    message: { type: String, trim: true, maxlength: 3000 },
    packageName: { type: String, trim: true, maxlength: 80 },
    status: { type: String, enum: ['new', 'contacted', 'booked'], default: 'new' },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  },
  { timestamps: true }
);

export default mongoose.model('Inquiry', inquirySchema);
