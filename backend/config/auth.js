import jwt from 'jsonwebtoken';

export function createAuthToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is required. Set it in backend/.env.');

  return jwt.sign(
    { userId: user._id.toString(), role: user.role },
    secret,
    { expiresIn: '7d' }
  );
}
