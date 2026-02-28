const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    tickets: [{
        ticketId: { type: mongoose.Schema.Types.ObjectId },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true, default: 0 },
    }],
    totalAmount: {
        type: Number,
        required: true,
        default: 0,
    },
    paymentIntentId: {
        type: String,
        default: '',
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded', 'free'],
        default: 'pending',
    },
    checkedIn: {
        type: Boolean,
        default: false,
    },
    checkedInAt: {
        type: Date,
    },
}, {
    timestamps: true,
});

// Prevent duplicate registrations
registrationSchema.index({ event: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
