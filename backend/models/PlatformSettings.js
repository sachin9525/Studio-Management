import mongoose from 'mongoose';

export const defaultPlatformSettings = {
  brandName: 'SVML Studio',
  contactEmail: 'hello@svml.studio',
  bookingEmail: 'bookings@svml.studio',
  phone: '+91 98765 43210',
  whatsappNumber: '919876543210',
  streetAddress: '42 MP Nagar',
  city: 'Bhopal',
  state: 'Madhya Pradesh',
  postalCode: '462011',
  businessHours: 'Mon–Sat, 10am–7pm',
};

const platformSettingsSchema = new mongoose.Schema(
  {
    _id: { type: String, default: 'global' },
    brandName: { type: String, required: true, trim: true, maxlength: 80, default: defaultPlatformSettings.brandName },
    contactEmail: { type: String, required: true, trim: true, lowercase: true, maxlength: 254, default: defaultPlatformSettings.contactEmail },
    bookingEmail: { type: String, trim: true, lowercase: true, maxlength: 254, default: defaultPlatformSettings.bookingEmail },
    phone: { type: String, required: true, trim: true, maxlength: 40, default: defaultPlatformSettings.phone },
    whatsappNumber: { type: String, trim: true, maxlength: 40, default: defaultPlatformSettings.whatsappNumber },
    streetAddress: { type: String, trim: true, maxlength: 160, default: defaultPlatformSettings.streetAddress },
    city: { type: String, trim: true, maxlength: 100, default: defaultPlatformSettings.city },
    state: { type: String, trim: true, maxlength: 100, default: defaultPlatformSettings.state },
    postalCode: { type: String, trim: true, maxlength: 20, default: defaultPlatformSettings.postalCode },
    businessHours: { type: String, trim: true, maxlength: 100, default: defaultPlatformSettings.businessHours },
  },
  { timestamps: true }
);

export default mongoose.model('PlatformSettings', platformSettingsSchema);
