const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Generate JWT
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
};

// ── POST /api/auth/register ──
router.post('/register', [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password, company, role } = req.body;

        // Check if user exists
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const user = await User.create({
            name,
            email,
            password,
            company: company || '',
            role: role === 'organizer' ? 'organizer' : 'user',
        });

        const token = generateToken(user._id);

        res.status(201).json({
            token,
            user: user.toJSON(),
        });
    } catch (error) {
        next(error);
    }
});

// ── POST /api/auth/login ──
router.post('/login', [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        // Find user with password field
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = generateToken(user._id);

        res.json({
            token,
            user: user.toJSON(),
        });
    } catch (error) {
        next(error);
    }
});

// ── GET /api/auth/me ──
router.get('/me', auth, async (req, res) => {
    res.json({ user: req.user });
});

// ── PUT /api/auth/me ──
router.put('/me', auth, [
    body('name').optional().trim().notEmpty(),
    body('company').optional().trim(),
    body('phone').optional().trim(),
], async (req, res, next) => {
    try {
        const updates = {};
        const allowed = ['name', 'company', 'phone', 'avatar'];
        allowed.forEach(field => {
            if (req.body[field] !== undefined) updates[field] = req.body[field];
        });

        const user = await User.findByIdAndUpdate(req.userId, updates, { new: true });
        res.json({ user });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
