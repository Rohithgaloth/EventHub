const express = require('express');
const { auth } = require('../middleware/auth');
const Registration = require('../models/Registration');
const Event = require('../models/Event');

const router = express.Router();

// Initialize Stripe (gracefully handle missing key)
let stripe = null;
try {
    if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_placeholder') {
        stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    }
} catch (e) {
    console.log('⚠️  Stripe not configured. Payment features disabled.');
}

// ── POST /api/payments/create-intent ── Create Stripe PaymentIntent
router.post('/create-intent', auth, async (req, res, next) => {
    try {
        if (!stripe) {
            return res.status(503).json({
                error: 'Payment processing not configured. Add STRIPE_SECRET_KEY to .env',
                fallback: true,
            });
        }

        const { eventId, tickets } = req.body;

        // Validate event and calculate amount
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        let totalAmount = 0;
        for (const t of tickets) {
            const eventTicket = event.tickets.id(t.ticketId);
            if (!eventTicket) {
                return res.status(400).json({ error: 'Invalid ticket tier' });
            }
            totalAmount += eventTicket.price * t.quantity;
        }

        if (totalAmount === 0) {
            return res.json({ free: true, message: 'This is a free event' });
        }

        // Create PaymentIntent (amount in cents)
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(totalAmount * 100),
            currency: 'usd',
            metadata: {
                eventId: event._id.toString(),
                userId: req.userId.toString(),
            },
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            amount: totalAmount,
        });
    } catch (error) {
        next(error);
    }
});

// ── POST /api/payments/webhook ── Stripe webhook
router.post('/webhook', async (req, res) => {
    if (!stripe) {
        return res.status(200).json({ received: true });
    }

    let event;

    try {
        const sig = req.headers['stripe-signature'];
        if (process.env.STRIPE_WEBHOOK_SECRET && process.env.STRIPE_WEBHOOK_SECRET !== 'whsec_placeholder') {
            event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        } else {
            event = JSON.parse(req.body);
        }
    } catch (err) {
        console.log('⚠️  Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const { eventId, userId } = paymentIntent.metadata;

        // Update registration payment status
        await Registration.findOneAndUpdate(
            {
                event: eventId,
                user: userId,
                paymentStatus: 'pending',
            },
            {
                paymentStatus: 'completed',
                paymentIntentId: paymentIntent.id,
            }
        );

        console.log(`✅ Payment succeeded for event ${eventId}, user ${userId}`);
    }

    res.json({ received: true });
});

// ── GET /api/payments/status/:registrationId ── Check payment status
router.get('/status/:registrationId', auth, async (req, res, next) => {
    try {
        const registration = await Registration.findById(req.params.registrationId);
        if (!registration) {
            return res.status(404).json({ error: 'Registration not found' });
        }

        res.json({
            paymentStatus: registration.paymentStatus,
            totalAmount: registration.totalAmount,
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
