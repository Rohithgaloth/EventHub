const express = require('express');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { auth } = require('../middleware/auth');

const router = express.Router();

// ── POST /api/registrations ── Register for an event
router.post('/', auth, async (req, res, next) => {
    try {
        const { eventId, tickets } = req.body;

        // Find event
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Check for duplicate registration
        const existing = await Registration.findOne({ event: eventId, user: req.userId });
        if (existing) {
            return res.status(400).json({ error: 'Already registered for this event' });
        }

        // Calculate total and validate tickets
        let totalAmount = 0;
        const registrationTickets = [];

        for (const t of tickets) {
            const eventTicket = event.tickets.id(t.ticketId);
            if (!eventTicket) {
                return res.status(400).json({ error: `Ticket tier not found: ${t.ticketId}` });
            }
            if (eventTicket.sold + t.quantity > eventTicket.quantity) {
                return res.status(400).json({ error: `Not enough tickets available for ${eventTicket.name}` });
            }

            registrationTickets.push({
                ticketId: eventTicket._id,
                name: eventTicket.name,
                quantity: t.quantity,
                price: eventTicket.price,
            });

            totalAmount += eventTicket.price * t.quantity;

            // Update sold count
            eventTicket.sold += t.quantity;
        }

        await event.save();

        // Create registration
        const registration = await Registration.create({
            event: eventId,
            user: req.userId,
            tickets: registrationTickets,
            totalAmount,
            paymentStatus: totalAmount === 0 ? 'free' : 'pending',
        });

        // Update event stats
        await Event.findByIdAndUpdate(eventId, {
            $inc: {
                totalRegistrations: registrationTickets.reduce((sum, t) => sum + t.quantity, 0),
                totalRevenue: totalAmount,
            }
        });

        await registration.populate('event', 'title date venue city');
        await registration.populate('user', 'name email');

        res.status(201).json({ registration });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Already registered for this event' });
        }
        next(error);
    }
});

// ── GET /api/registrations/my ── User's registrations
router.get('/my', auth, async (req, res, next) => {
    try {
        const registrations = await Registration.find({ user: req.userId })
            .populate('event', 'title date venue city coverImage category')
            .sort('-createdAt');

        res.json({ registrations });
    } catch (error) {
        next(error);
    }
});

// ── GET /api/registrations/event/:eventId ── Event attendees (organizer only)
router.get('/event/:eventId', auth, async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        if (event.organizer.toString() !== req.userId.toString()) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const registrations = await Registration.find({ event: req.params.eventId })
            .populate('user', 'name email phone company')
            .sort('-createdAt');

        res.json({ registrations, total: registrations.length });
    } catch (error) {
        next(error);
    }
});

// ── PUT /api/registrations/:id/checkin ── Check in attendee
router.put('/:id/checkin', auth, async (req, res, next) => {
    try {
        const registration = await Registration.findById(req.params.id)
            .populate('event');

        if (!registration) {
            return res.status(404).json({ error: 'Registration not found' });
        }

        if (registration.event.organizer.toString() !== req.userId.toString()) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        registration.checkedIn = true;
        registration.checkedInAt = new Date();
        await registration.save();

        res.json({ registration });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
