import bcrypt from 'bcryptjs';
import { createAuthToken } from '../config/auth.js';
import User from '../models/User.js';

export async function registerVendor(req, res) {
  const { ownerName, studioName, email, phone, password, address, city, state } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(409).json({ message: 'An account with this email already exists.' });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    fullName: ownerName,
    email,
    passwordHash,
    role: 'vendor',
    status: 'pending',
    studioName,
    phone,
    address,
    city,
    state,
  });

  return res.status(201).json({
    message: 'Vendor account created successfully.',
    user: { id: user._id, email: user.email, role: user.role, status: user.status },
  });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  if (user.status === 'suspended') {
    return res.status(403).json({ message: 'This account has been suspended.' });
  }

  return res.json({
    token: createAuthToken(user),
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      status: user.status,
      fullName: user.fullName,
      studioName: user.studioName,
      studioSlug: user.studioSlug,
      phone: user.phone,
      address: user.address,
      city: user.city,
      state: user.state,
    },
  });
}

export async function getCurrentUser(req, res) {
  try {
    const user = await User.findById(req.auth.userId).select('-passwordHash');
    if (!user) return res.status(401).json({ message: 'Account not found.' });

    return res.json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        status: user.status,
        fullName: user.fullName,
        studioName: user.studioName,
        studioSlug: user.studioSlug,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
      },
    });
  } catch (error) {
    console.error('Unable to load authenticated user:', error.message);
    return res.status(500).json({ message: 'Unable to load account.' });
  }
}
