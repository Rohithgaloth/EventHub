import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Filter, Users, Clock, ArrowRight, Tag } from 'lucide-react';
import { eventsAPI } from '../api/client';
import './Events.css';

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 0) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }
    })
};

const categories = ['All', 'Conference', 'Workshop', 'Hackathon', 'Meetup', 'Concert', 'Sports'];

// Fallback sample data when backend is not available
const sampleEvents = [
    { _id: '1', title: 'Global Tech Summit 2026', date: '2026-03-15', city: 'San Francisco, CA', category: 'Conference', tickets: [{ price: 299 }], totalRegistrations: 5000, featured: true },
    { _id: '2', title: 'AI & Machine Learning Workshop', date: '2026-04-05', city: 'New York, NY', category: 'Workshop', tickets: [{ price: 49 }], totalRegistrations: 200, featured: false },
    { _id: '3', title: 'Hack the Future 2026', date: '2026-04-20', city: 'Austin, TX', category: 'Hackathon', tickets: [{ price: 0 }], totalRegistrations: 1500, featured: true },
    { _id: '4', title: 'DevOps Community Meetup', date: '2026-03-28', city: 'Seattle, WA', category: 'Meetup', tickets: [{ price: 0 }], totalRegistrations: 150, featured: false },
    { _id: '5', title: 'Neon Music Festival', date: '2026-05-10', city: 'Miami, FL', category: 'Concert', tickets: [{ price: 150 }], totalRegistrations: 10000, featured: true },
    { _id: '6', title: 'City Marathon Championship', date: '2026-06-01', city: 'Chicago, IL', category: 'Sports', tickets: [{ price: 75 }], totalRegistrations: 8000, featured: false },
    { _id: '7', title: 'Cloud Native Conference', date: '2026-05-25', city: 'London, UK', category: 'Conference', tickets: [{ price: 199 }], totalRegistrations: 3000, featured: false },
    { _id: '8', title: 'UX Design Masterclass', date: '2026-04-15', city: 'Berlin, Germany', category: 'Workshop', tickets: [{ price: 79 }], totalRegistrations: 100, featured: false },
    { _id: '9', title: 'Startup Pitch Night', date: '2026-03-30', city: 'Bangalore, India', category: 'Meetup', tickets: [{ price: 0 }], totalRegistrations: 300, featured: false },
];

const gradients = [
    'linear-gradient(135deg, #6d10ff 0%, #00d4ff 100%)',
    'linear-gradient(135deg, #8533ff 0%, #f59e0b 100%)',
    'linear-gradient(135deg, #00d4ff 0%, #34d399 100%)',
    'linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)',
    'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    'linear-gradient(135deg, #34d399 0%, #00d4ff 100%)',
    'linear-gradient(135deg, #6d10ff 0%, #ef4444 100%)',
    'linear-gradient(135deg, #8533ff 0%, #00d4ff 100%)',
    'linear-gradient(135deg, #f59e0b 0%, #6d10ff 100%)',
];

export default function Events() {
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [usingAPI, setUsingAPI] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, [activeCategory]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const params = {};
            if (activeCategory !== 'All') params.category = activeCategory;
            if (search) params.search = search;
            const res = await eventsAPI.getAll(params);
            setEvents(res.data.events);
            setUsingAPI(true);
        } catch (err) {
            // Backend not available, use sample data
            setEvents(sampleEvents);
            setUsingAPI(false);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const handleSearchSubmit = () => {
        fetchEvents();
    };

    const filtered = usingAPI ? events : events.filter(e => {
        const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
            e.city?.toLowerCase().includes(search.toLowerCase());
        const matchCategory = activeCategory === 'All' || e.category === activeCategory;
        return matchSearch && matchCategory;
    });

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getTicketPrice = (event) => {
        if (!event.tickets || event.tickets.length === 0) return 'Free';
        const minPrice = Math.min(...event.tickets.map(t => t.price));
        return minPrice === 0 ? 'Free' : `$${minPrice}`;
    };

    return (
        <div className="events-page">
            <section className="events-hero">
                <div className="events-hero__bg">
                    <div className="events-hero__orb events-hero__orb--1" />
                    <div className="events-hero__orb events-hero__orb--2" />
                </div>
                <div className="container events-hero__content">
                    <motion.span initial="hidden" animate="visible" variants={fadeUp} className="section-label">Discover</motion.span>
                    <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={1}>
                        Find Your Next <span className="text-gradient">Amazing Event</span>
                    </motion.h1>
                    <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={2} className="events-hero__desc">
                        Explore thousands of events across the globe — from tech conferences to music festivals.
                    </motion.p>
                </div>
            </section>

            <section className="events-filters">
                <div className="container">
                    <div className="search-bar glass">
                        <Search size={20} className="search-bar__icon" />
                        <input
                            type="text"
                            placeholder="Search events by name or location..."
                            className="search-bar__input"
                            value={search}
                            onChange={handleSearch}
                            onKeyDown={e => e.key === 'Enter' && handleSearchSubmit()}
                        />
                        <button className="btn btn-primary btn-sm" onClick={handleSearchSubmit}>
                            <Filter size={16} /> Filter
                        </button>
                    </div>

                    <div className="category-tabs">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`category-tab ${activeCategory === cat ? 'category-tab--active' : ''}`}
                                onClick={() => setActiveCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section events-list">
                <div className="container">
                    {loading ? (
                        <div className="events-empty"><h3>Loading events...</h3></div>
                    ) : filtered.length === 0 ? (
                        <div className="events-empty">
                            <h3>No events found</h3>
                            <p>Try adjusting your search or filters.</p>
                        </div>
                    ) : (
                        <div className="events-grid">
                            {filtered.map((event, i) => (
                                <motion.div
                                    key={event._id}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={fadeUp}
                                    custom={i % 3}
                                >
                                    <Link to={`/events/${event._id}`} className="event-card">
                                        <div className="event-card__image" style={{
                                            background: event.coverImage
                                                ? `url(http://localhost:5000${event.coverImage}) center/cover`
                                                : gradients[i % gradients.length]
                                        }}>
                                            {event.featured && <span className="event-card__featured">Featured</span>}
                                            <span className="event-card__category badge badge-primary">{event.category}</span>
                                        </div>
                                        <div className="event-card__body">
                                            <h4 className="event-card__title">{event.title}</h4>
                                            <div className="event-card__info">
                                                <span><Calendar size={14} /> {formatDate(event.date)}</span>
                                                <span><MapPin size={14} /> {event.city || event.venue || 'TBA'}</span>
                                            </div>
                                            <div className="event-card__footer">
                                                <div className="event-card__price">
                                                    <Tag size={14} />
                                                    <span>{getTicketPrice(event)}</span>
                                                </div>
                                                <div className="event-card__attendees">
                                                    <Users size={14} />
                                                    <span>{(event.totalRegistrations || 0).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
