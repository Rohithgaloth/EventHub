import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Users, Minus, Plus, Tag, Share2, Heart, Globe, ArrowLeft } from 'lucide-react';
import { eventsAPI, registrationsAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import './EventDetail.css';

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 0) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }
    })
};

// Fallback sample event
const sampleEvent = {
    _id: '1',
    title: 'Global Tech Summit 2026',
    description: 'The Global Tech Summit brings together the brightest minds in technology for three days of innovation, networking, and knowledge sharing. Featuring world-class speakers, hands-on workshops, and cutting-edge demos across AI, Cloud Computing, Web3, and more. Whether you\'re a developer, designer, founder, or tech enthusiast, this is the event to attend in 2026.',
    category: 'Conference',
    type: 'in-person',
    date: '2026-03-15T09:00:00Z',
    endDate: '2026-03-17T18:00:00Z',
    time: '09:00',
    endTime: '18:00',
    venue: 'Moscone Center',
    city: 'San Francisco, CA',
    country: 'USA',
    organizer: { name: 'TechEvents Inc.', email: 'info@techevents.com' },
    tickets: [
        { _id: 't1', name: 'General Admission', price: 299, quantity: 5000, sold: 3200, description: 'Full access to all sessions' },
        { _id: 't2', name: 'VIP Pass', price: 599, quantity: 500, sold: 280, description: 'VIP lounge, priority seating, meet & greet' },
        { _id: 't3', name: 'Workshop Only', price: 149, quantity: 1000, sold: 420, description: 'Access to workshops only' },
    ],
    speakers: [
        { name: 'Sarah Chen', role: 'CEO, FutureAI', bio: 'Pioneer in generative AI' },
        { name: 'Marcus Williams', role: 'CTO, CloudScale', bio: 'Cloud infrastructure expert' },
        { name: 'Dr. Priya Patel', role: 'Research Lead, DeepTech', bio: 'AI researcher and bestselling author' },
        { name: 'Alex Kim', role: 'VP Engineering, WebCo', bio: 'Full-stack architect and speaker' },
    ],
    agenda: [
        { time: '09:00', title: 'Registration & Welcome Coffee', type: 'break' },
        { time: '10:00', title: 'Opening Keynote: The Future of AI', type: 'keynote' },
        { time: '11:30', title: 'Cloud-Native Architecture Workshop', type: 'workshop' },
        { time: '13:00', title: 'Lunch Break & Networking', type: 'break' },
        { time: '14:00', title: 'Panel: Building at Scale', type: 'session' },
        { time: '15:30', title: 'Hands-on: LLM Fine-tuning', type: 'workshop' },
        { time: '17:00', title: 'Closing Remarks & Happy Hour', type: 'break' },
    ],
    totalRegistrations: 4821,
};

const gradients = [
    'linear-gradient(135deg, #6d10ff 0%, #00d4ff 100%)',
    'linear-gradient(135deg, #8533ff 0%, #f59e0b 100%)',
    'linear-gradient(135deg, #00d4ff 0%, #34d399 100%)',
];

export default function EventDetail() {
    const { id } = useParams();
    const { isAuthenticated } = useAuth();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [ticketQty, setTicketQty] = useState({});
    const [registerLoading, setRegisterLoading] = useState(false);
    const [registerMsg, setRegisterMsg] = useState('');

    useEffect(() => {
        fetchEvent();
    }, [id]);

    const fetchEvent = async () => {
        setLoading(true);
        try {
            const res = await eventsAPI.getById(id);
            setEvent(res.data.event);
            // Default quantities
            const qty = {};
            res.data.event.tickets.forEach(t => { qty[t._id] = 0; });
            setTicketQty(qty);
        } catch (err) {
            // Backend not available, use sample
            setEvent(sampleEvent);
            const qty = {};
            sampleEvent.tickets.forEach(t => { qty[t._id] = 0; });
            setTicketQty(qty);
        } finally {
            setLoading(false);
        }
    };

    const updateQty = (ticketId, delta) => {
        setTicketQty(prev => ({
            ...prev,
            [ticketId]: Math.max(0, (prev[ticketId] || 0) + delta)
        }));
    };

    const total = event ? event.tickets.reduce((sum, t) => sum + (t.price * (ticketQty[t._id] || 0)), 0) : 0;
    const hasTickets = Object.values(ticketQty).some(q => q > 0);

    const handleRegister = async () => {
        if (!isAuthenticated) {
            window.location.href = '/login';
            return;
        }
        if (!hasTickets) return;

        setRegisterLoading(true);
        setRegisterMsg('');
        try {
            const tickets = event.tickets
                .filter(t => ticketQty[t._id] > 0)
                .map(t => ({ ticketId: t._id, quantity: ticketQty[t._id] }));

            await registrationsAPI.register({ eventId: event._id, tickets });
            setRegisterMsg('✅ Registration successful! Check your email for confirmation.');
        } catch (err) {
            setRegisterMsg(err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setRegisterLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="event-detail" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: 'var(--neutral-400)' }}>Loading event...</p>
            </div>
        );
    }

    if (!event) return null;

    const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

    return (
        <div className="event-detail">
            {/* Banner */}
            <section className="event-banner" style={{
                background: event.coverImage
                    ? `url(http://localhost:5000${event.coverImage}) center/cover`
                    : gradients[0]
            }}>
                <div className="event-banner__overlay" />
                <div className="container event-banner__content">
                    <Link to="/events" className="event-banner__back"><ArrowLeft size={16} /> Back to events</Link>
                    <motion.div initial="hidden" animate="visible" variants={fadeUp}>
                        <span className="badge badge-primary">{event.category}</span>
                        <h1>{event.title}</h1>
                        <div className="event-banner__meta">
                            <span><Calendar size={16} /> {formatDate(event.date)}</span>
                            <span><MapPin size={16} /> {event.venue || event.city || 'TBA'}</span>
                            <span><Users size={16} /> {(event.totalRegistrations || 0).toLocaleString()} attendees</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Content */}
            <section className="section event-content">
                <div className="container">
                    <div className="event-layout">
                        {/* Main */}
                        <div className="event-main">
                            <motion.div className="card event-section" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                                <h3>About This Event</h3>
                                <p className="event-description">{event.description}</p>
                                <div className="event-info-grid">
                                    <div className="event-info-item">
                                        <Calendar size={18} />
                                        <div>
                                            <strong>Date</strong>
                                            <span>{formatDate(event.date)}</span>
                                        </div>
                                    </div>
                                    <div className="event-info-item">
                                        <Clock size={18} />
                                        <div>
                                            <strong>Time</strong>
                                            <span>{event.time || '09:00'} – {event.endTime || '18:00'}</span>
                                        </div>
                                    </div>
                                    <div className="event-info-item">
                                        <MapPin size={18} />
                                        <div>
                                            <strong>Venue</strong>
                                            <span>{event.venue || 'TBA'}{event.city ? `, ${event.city}` : ''}</span>
                                        </div>
                                    </div>
                                    <div className="event-info-item">
                                        <Globe size={18} />
                                        <div>
                                            <strong>Type</strong>
                                            <span style={{ textTransform: 'capitalize' }}>{event.type || 'In-person'}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Agenda */}
                            {event.agenda && event.agenda.length > 0 && (
                                <motion.div className="card event-section" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                                    <h3>Agenda</h3>
                                    <div className="agenda-timeline">
                                        {event.agenda.map((item, i) => (
                                            <div key={i} className={`agenda-item agenda-item--${item.type}`}>
                                                <div className="agenda-item__time">{item.time}</div>
                                                <div className="agenda-item__dot" />
                                                <div className="agenda-item__content">
                                                    <span className="agenda-item__type">{item.type}</span>
                                                    <h4>{item.title}</h4>
                                                    {item.description && <p>{item.description}</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Speakers */}
                            {event.speakers && event.speakers.length > 0 && (
                                <motion.div className="card event-section" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                                    <h3>Featured Speakers</h3>
                                    <div className="speakers-grid">
                                        {event.speakers.map((speaker, i) => (
                                            <div key={i} className="speaker-card">
                                                <div className="speaker-card__avatar" style={{ background: gradients[i % gradients.length] }}>
                                                    {speaker.name.charAt(0)}
                                                </div>
                                                <h4>{speaker.name}</h4>
                                                <p className="speaker-card__role">{speaker.role}</p>
                                                {speaker.bio && <p className="speaker-card__bio">{speaker.bio}</p>}
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <aside className="event-sidebar">
                            <motion.div className="card ticket-card" initial="hidden" animate="visible" variants={fadeUp} custom={2}>
                                <h3>Select Tickets</h3>
                                <div className="ticket-list">
                                    {event.tickets.map(ticket => (
                                        <div key={ticket._id} className="ticket-row">
                                            <div className="ticket-row__info">
                                                <h5>{ticket.name}</h5>
                                                <span className="ticket-row__price">
                                                    {ticket.price === 0 ? 'Free' : `$${ticket.price}`}
                                                </span>
                                                {ticket.description && <p className="ticket-row__desc">{ticket.description}</p>}
                                                <span className="ticket-row__avail">
                                                    {ticket.quantity - (ticket.sold || 0)} remaining
                                                </span>
                                            </div>
                                            <div className="ticket-row__qty">
                                                <button className="qty-btn" onClick={() => updateQty(ticket._id, -1)}>
                                                    <Minus size={14} />
                                                </button>
                                                <span>{ticketQty[ticket._id] || 0}</span>
                                                <button className="qty-btn" onClick={() => updateQty(ticket._id, 1)}>
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="ticket-total">
                                    <span>Total</span>
                                    <span className="ticket-total__amount">
                                        {total === 0 && hasTickets ? 'Free' : `$${total.toLocaleString()}`}
                                    </span>
                                </div>

                                {registerMsg && (
                                    <div style={{
                                        padding: '12px',
                                        borderRadius: '8px',
                                        fontSize: '0.85rem',
                                        marginBottom: '12px',
                                        background: registerMsg.includes('✅') ? 'rgba(52,211,153,0.1)' : 'rgba(239,68,68,0.1)',
                                        color: registerMsg.includes('✅') ? '#34d399' : '#f87171',
                                        textAlign: 'center'
                                    }}>
                                        {registerMsg}
                                    </div>
                                )}

                                <button
                                    className="btn btn-primary ticket-buy-btn"
                                    onClick={handleRegister}
                                    disabled={(!hasTickets) || registerLoading}
                                >
                                    {registerLoading ? 'Processing...' : hasTickets ? 'Register Now' : 'Select Tickets'}
                                </button>

                                <div className="ticket-actions">
                                    <button className="ticket-actions__btn"><Share2 size={16} /> Share</button>
                                    <button className="ticket-actions__btn"><Heart size={16} /> Save</button>
                                </div>
                            </motion.div>

                            {event.organizer && (
                                <div className="card organizer-card">
                                    <h5>Organized by</h5>
                                    <div className="organizer-info">
                                        <div className="organizer-avatar" style={{ background: 'var(--gradient-primary)' }}>
                                            {(event.organizer.name || 'O').charAt(0)}
                                        </div>
                                        <div>
                                            <strong>{event.organizer.name}</strong>
                                            {event.organizer.email && <p>{event.organizer.email}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </aside>
                    </div>
                </div>
            </section>
        </div>
    );
}
