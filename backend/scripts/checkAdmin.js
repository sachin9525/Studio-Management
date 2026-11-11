import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import { connectDatabase } from '../config/db.js';
import User from '../models/User.js';

dotenv.config({ path: fileURLToPath(new URL('../.env', import.meta.url)) });

async function run() {
  try {
    await connectDatabase();
    console.log('--- DB CONNECTED ---');
    console.log('ENV ADMIN_EMAIL:', process.env.ADMIN_EMAIL);
    console.log('ENV ADMIN_PASSWORD:', process.env.ADMIN_PASSWORD);

    const users = await User.find({});
    console.log(`Found ${users.length} users in database:`);
    for (const u of users) {
      console.log(`User: ${u.email} | Role: ${u.role} | Status: ${u.status}`);
      if (process.env.ADMIN_PASSWORD) {
        const matchesEnv = await bcrypt.compare(process.env.ADMIN_PASSWORD, u.passwordHash);
        console.log(`  Matches ENV ADMIN_PASSWORD (${process.env.ADMIN_PASSWORD}):`, matchesEnv);
      }
      // Common passwords check
      for (const testPass of ['admin', 'admin123', 'Admin123', 'Admin@123', 'admin@123', 'Sachin123', '123456', 'change-this-admin-password-123']) {
        const match = await bcrypt.compare(testPass, u.passwordHash);
        if (match) {
          console.log(`  >>> PASSWORD MATCH FOUND: "${testPass}" <<<`);
        }
      }
    }
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

run();

