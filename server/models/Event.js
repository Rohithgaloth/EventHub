const mongoose = require('mongoose');

const ticketTierSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    quantity: { type: Number, required: true, default: 100 },
    sold: { type: Number, default: 0 },
    description: { type: String, default: '' },
}, { _id: true });

const speakerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, default: '' },
    bio: { type: String, default: '' },
    avatar: { type: String, default: '' },
}, { _id: true });

const agendaItemSchema = new mongoose.Schema({
    time: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    type: { type: String, enum: ['keynote', 'session', 'workshop', 'break', 'other'], default: 'session' },
}, { _id: true });

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Event title is required'],
        trim: true,
        maxlength: 200,
    },
    description: {
        type: String,
        required: [true, 'Event description is required'],
        maxlength: 5000,
    },
    category: {
        type: String,
        required: true,
        enum: ['Conference', 'Workshop', 'Hackathon', 'Meetup', 'Concert', 'Sports', 'Expo', 'Festival', 'Other'],
    },
    type: {
        type: String,
        enum: ['in-person', 'virtual', 'hybrid'],
        default: 'in-person',
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: Date,
        required: [true, 'Event start date is required'],
    },
    endDate: {
        type: Date,
    },
    time: { type: String, default: '' },
    endTime: { type: String, default: '' },
    venue: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    country: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    tickets: [ticketTierSchema],
    speakers: [speakerSchema],
    agenda: [agendaItemSchema],
    status: {
        type: String,
        enum: ['draft', 'published', 'cancelled', 'completed'],
        default: 'published',
    },
    featured: {
        type: Boolean,
        default: false,
    },
    totalRegistrations: {
        type: Number,
        default: 0,
    },
    totalRevenue: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

// Index for search
eventSchema.index({ title: 'text', description: 'text', city: 'text' });
eventSchema.index({ category: 1, status: 1, date: -1 });

module.exports = mongoose.model('Event', eventSchema);
