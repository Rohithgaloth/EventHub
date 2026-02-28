const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Event = require('../models/Event');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// ── GET /api/events ── List events (public)
router.get('/', async (req, res, next) => {
    try {
        const {
            search, category, status = 'published',
            page = 1, limit = 12, sort = '-date'
        } = req.query;

        const filter = { status };

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { city: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        if (category && category !== 'All') {
            filter.category = category;
        }

        const total = await Event.countDocuments(filter);
        const events = await Event.find(filter)
            .populate('organizer', 'name email avatar')
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.json({
            events,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        next(error);
    }
});

// ── GET /api/events/my ── Organizer's events (auth required)
router.get('/my', auth, async (req, res, next) => {
    try {
        const events = await Event.find({ organizer: req.userId })
            .sort('-createdAt');
        res.json({ events });
    } catch (error) {
        next(error);
    }
});

// ── GET /api/events/:id ── Single event (public)
router.get('/:id', async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('organizer', 'name email avatar company');

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.json({ event });
    } catch (error) {
        next(error);
    }
});

// ── POST /api/events ── Create event (auth required)
router.post('/', auth, [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('date').notEmpty().withMessage('Start date is required'),
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const eventData = {
            ...req.body,
            organizer: req.userId,
        };

        const event = await Event.create(eventData);
        await event.populate('organizer', 'name email avatar');

        // Update user role to organizer
        if (req.user.role === 'user') {
            req.user.role = 'organizer';
            await req.user.save();
        }

        res.status(201).json({ event });
    } catch (error) {
        next(error);
    }
});

// ── PUT /api/events/:id ── Update event (owner only)
router.put('/:id', auth, async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        if (event.organizer.toString() !== req.userId.toString()) {
            return res.status(403).json({ error: 'Not authorized to update this event' });
        }

        const updated = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('organizer', 'name email avatar');

        res.json({ event: updated });
    } catch (error) {
        next(error);
    }
});

// ── DELETE /api/events/:id ── Delete event (owner only)
router.delete('/:id', auth, async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        if (event.organizer.toString() !== req.userId.toString()) {
            return res.status(403).json({ error: 'Not authorized to delete this event' });
        }

        await event.deleteOne();
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
