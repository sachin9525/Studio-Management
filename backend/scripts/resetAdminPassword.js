import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import { connectDatabase } from '../config/db.js';
import User from '../models/User.js';

dotenv.config({ path: fileURLToPath(new URL('../.env', import.meta.url)) });

async function resetPassword() {
  const newPassword = process.argv[2] || process.env.ADMIN_PASSWORD || 'Admin@123';
  const email = process.env.ADMIN_EMAIL || 'admin@svml.studio';

  await connectDatabase();
  const passwordHash = await bcrypt.hash(newPassword, 12);

  const updated = await User.findOneAndUpdate(
    { email },
    { passwordHash, role: 'admin', status: 'approved' },
    { new: true, upsert: true }
  );

  console.log(`Successfully updated password for ${email}`);
  console.log(`New password is: ${newPassword}`);
  process.exit(0);
}

resetPassword().catch(err => {
  console.error(err);
  process.exit(1);
});
