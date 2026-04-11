import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import express from 'express';

// Simulated DB for demonstration. Real apps DO NOT hardcode this here!
// We hash passwords with salt rounds = 10, conforming to modern standards.
const usersDB = [
  {
    id: 1,
    username: 'admin_user',
    passwordHash: bcrypt.hashSync('SuperSecurePassword123!', 10),
    role: 'ORGANIZER' // RBAC Principle
  }
];

export const authRouter = express.Router();

authRouter.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required.' });
  }

  const user = usersDB.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  const validPassword = bcrypt.compareSync(password, user.passwordHash);
  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('System Secret Env Mismatch Error');

  const token = jwt.sign(
    { sub: user.id, username: user.username, role: user.role },
    secret,
    { expiresIn: '1h' } // Token Expiration Implementation
  );

  res.json({ token, role: user.role });
});
