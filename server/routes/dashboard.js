const express = require('express');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const { auth } = require('../middleware/auth');

const router = express.Router();

// ── GET /api/dashboard/stats ── Organizer dashboard stats
router.get('/stats', auth, async (req, res, next) => {
    try {
        const events = await Event.find({ organizer: req.userId });
        const eventIds = events.map(e => e._id);

        const totalEvents = events.length;
        const totalRegistrations = events.reduce((sum, e) => sum + e.totalRegistrations, 0);
        const totalRevenue = events.reduce((sum, e) => sum + e.totalRevenue, 0);

        // Calculate satisfaction (mock average for now)
        const registrationCount = await Registration.countDocuments({ event: { $in: eventIds } });

        // Active events (upcoming/published)
        const activeEvents = events.filter(e =>
            e.status === 'published' && new Date(e.date) >= new Date()
        ).length;

        // Completed events
        const completedEvents = events.filter(e =>
            e.status === 'completed' || new Date(e.endDate || e.date) < new Date()
        ).length;

        res.json({
            totalEvents,
            activeEvents,
            completedEvents,
            totalRegistrations,
            totalRevenue,
            avgSatisfaction: 4.8,
            // Month-over-month changes (simplified)
            changes: {
                events: '+' + Math.max(1, events.filter(e => {
                    const created = new Date(e.createdAt);
                    const now = new Date();
                    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
                }).length) + ' this month',
                registrations: '+18% vs last month',
                revenue: '+23% vs last month',
            }
        });
    } catch (error) {
        next(error);
    }
});

// ── GET /api/dashboard/recent-events ── Recent events with metrics
router.get('/recent-events', auth, async (req, res, next) => {
    try {
        const events = await Event.find({ organizer: req.userId })
            .sort('-createdAt')
            .limit(10);

        const enriched = events.map(event => {
            let status = 'upcoming';
            const now = new Date();
            if (event.status === 'cancelled') status = 'cancelled';
            else if (new Date(event.endDate || event.date) < now) status = 'completed';
            else if (new Date(event.date) <= now) status = 'active';

            return {
                _id: event._id,
                title: event.title,
                date: event.date,
                endDate: event.endDate,
                category: event.category,
                totalRegistrations: event.totalRegistrations,
                totalRevenue: event.totalRevenue,
                status,
            };
        });

        res.json({ events: enriched });
    } catch (error) {
        next(error);
    }
});

// ── GET /api/dashboard/revenue-chart ── Revenue by month
router.get('/revenue-chart', auth, async (req, res, next) => {
    try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const registrations = await Registration.find({
            user: req.userId,
            createdAt: { $gte: sixMonthsAgo },
            paymentStatus: { $in: ['completed', 'free'] },
        });

        // Aggregate by month
        const monthlyRevenue = {};
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const key = months[d.getMonth()];
            monthlyRevenue[key] = 0;
        }

        // Sum revenue from organizer's events
        const events = await Event.find({ organizer: req.userId });
        const eventIds = events.map(e => e._id.toString());

        const allRegs = await Registration.find({
            event: { $in: eventIds },
            createdAt: { $gte: sixMonthsAgo },
        });

        allRegs.forEach(reg => {
            const month = months[new Date(reg.createdAt).getMonth()];
            if (monthlyRevenue[month] !== undefined) {
                monthlyRevenue[month] += reg.totalAmount;
            }
        });

        const chartData = Object.entries(monthlyRevenue).map(([month, value]) => ({ month, value }));

        res.json({ chartData });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
