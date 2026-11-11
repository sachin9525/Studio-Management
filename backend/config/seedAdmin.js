import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export async function seedAdmin() {
  const { ADMIN_EMAIL: email, ADMIN_PASSWORD: password } = process.env;
  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required. Set them in backend/.env.');
  }

  const existingAdmin = await User.findOne({ email });

  if (existingAdmin) {
    const isMatching = await bcrypt.compare(password, existingAdmin.passwordHash);
    if (!isMatching) {
      existingAdmin.passwordHash = await bcrypt.hash(password, 12);
      await existingAdmin.save();
      console.log(`Admin password updated from environment for ${email}`);
    }
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await User.create({
    fullName: 'Platform Admin',
    email,
    passwordHash,
    role: 'admin',
    status: 'approved',
  });

  console.log(`Admin account created for ${email}`);
}
