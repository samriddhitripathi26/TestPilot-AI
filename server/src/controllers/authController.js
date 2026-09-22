const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { localDb, isUsingMongo } = require('../config/db');
const User = require('../models/User');

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'testpilot_default_secret', {
    expiresIn: '7d'
  });
};

const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    if (isUsingMongo()) {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.status(400).json({ error: 'User with this email already exists.' });
      }
      const user = await User.create({
        email: email.toLowerCase(),
        password: passwordHash,
        name: name || 'Developer',
        isGuest: false
      });
      const token = generateToken({ id: user._id, email: user.email, name: user.name });
      return res.status(201).json({
        token,
        user: { id: user._id, email: user.email, name: user.name, isGuest: false }
      });
    } else {
      const existing = localDb.findUserByEmail(email);
      if (existing) {
        return res.status(400).json({ error: 'User with this email already exists.' });
      }
      const user = localDb.createUser({
        email: email.toLowerCase(),
        password: passwordHash,
        name: name || 'Developer',
        isGuest: false
      });
      const token = generateToken({ id: user.id, email: user.email, name: user.name });
      return res.status(201).json({
        token,
        user: { id: user.id, email: user.email, name: user.name, isGuest: false }
      });
    }
  } catch (err) {
    console.error('[Auth Register Error]:', err);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    let user;
    if (isUsingMongo()) {
      user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(400).json({ error: 'Invalid email or password.' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid email or password.' });
      }
      const token = generateToken({ id: user._id, email: user.email, name: user.name });
      return res.json({
        token,
        user: { id: user._id, email: user.email, name: user.name, isGuest: user.isGuest }
      });
    } else {
      user = localDb.findUserByEmail(email);
      if (!user) {
        return res.status(400).json({ error: 'Invalid email or password.' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid email or password.' });
      }
      const token = generateToken({ id: user.id, email: user.email, name: user.name });
      return res.json({
        token,
        user: { id: user.id, email: user.email, name: user.name, isGuest: user.isGuest }
      });
    }
  } catch (err) {
    console.error('[Auth Login Error]:', err);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
};

const guest = async (req, res) => {
  try {
    const guestId = 'guest_' + Math.random().toString(36).substr(2, 8);
    const guestEmail = `${guestId}@testpilot.demo`;
    const name = 'Pilot Guest';

    const token = generateToken({
      id: guestId,
      email: guestEmail,
      name,
      isGuest: true
    });

    return res.json({
      token,
      user: { id: guestId, email: guestEmail, name, isGuest: true }
    });
  } catch (err) {
    console.error('[Auth Guest Error]:', err);
    res.status(500).json({ error: 'Guest login failed.' });
  }
};

const me = async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user profile.' });
  }
};

module.exports = {
  register,
  login,
  guest,
  me
};
