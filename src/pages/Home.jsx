import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Zap, Globe, Users, BarChart3, Ticket, CalendarCheck, QrCode,
    Smartphone, Camera, Palette, Star, ArrowRight, Trophy, Mic2,
    GraduationCap, Music, Building2, Handshake, ChevronRight,
    CheckCircle2, Shield, Clock, Headphones
} from 'lucide-react';
import './Home.css';

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 0) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }
    })
};

const stats = [
    { value: '150+', label: 'Events Hosted', icon: CalendarCheck },
    { value: '1', label: 'Country (India)', icon: Globe },
    { value: '5,000+', label: 'Attendees', icon: Users },
    { value: '97%', label: 'Satisfaction', icon: Star },
];

const features = [
    {
        title: 'Smart Ticketing',
        desc: 'Comprehensive ticketing with categories, group discounts, hidden tickets, and approval-based registrations.',
        icon: Ticket,
        color: '#6d10ff'
    },
    {
        title: 'AI Check-in',
        desc: 'Face-detection based check-in, QR code scanning, self-service kiosks, and badge printing.',
        icon: QrCode,
        color: '#00d4ff'
    },
    {
        title: 'Event App',
        desc: 'Full-featured mobile app with schedules, networking, live updates, and lead capture tools.',
        icon: Smartphone,
        color: '#8533ff'
    },
    {
        title: 'AI Photo Booth',
        desc: 'AI-powered avatar photo booth and photo gallery that attendees love to share on social media.',
        icon: Camera,
        color: '#34d399'
    },
    {
        title: 'Event Website',
        desc: 'Beautiful, customizable event pages with 3 premium templates, white-labeling, and custom domains.',
        icon: Palette,
        color: '#f59e0b'
    },
    {
        title: 'Analytics Dashboard',
        desc: 'Real-time insights on registrations, revenue, traffic sources, and attendee engagement metrics.',
        icon: BarChart3,
        color: '#ef4444'
    },
];

const eventTypes = [
    { title: 'Conferences & Summits', desc: 'Large-scale tech and business conferences with multi-track agendas.', icon: Mic2, color: '#6d10ff' },
    { title: 'Marathons & Sports', desc: 'Manage races, tournaments, and sports events with timing integrations.', icon: Trophy, color: '#00d4ff' },
    { title: 'Music & Cultural', desc: 'Festivals, concerts, and cultural celebrations with immersive experiences.', icon: Music, color: '#f59e0b' },
    { title: 'Expos & Trade Fairs', desc: 'Exhibition management with exhibitor portals and lead capture.', icon: Building2, color: '#ef4444' },
    { title: 'Tech Fests & College', desc: 'Campus events, hackathons, and tech fests with team registrations.', icon: GraduationCap, color: '#34d399' },
    { title: 'Communities', desc: 'Meetups, association events, and community-driven gatherings.', icon: Handshake, color: '#8533ff' },
];

const testimonials = [
    {
        name: 'Sarah Chen',
        role: 'Event Director, TechConf Global',
        text: 'EventHub transformed how we manage our annual conference. The AI check-in alone saved us 3 hours of manual work. Absolutely game-changing!',
        rating: 5
    },
    {
        name: 'Marcus Johnson',
        role: 'Community Lead, DevOps Society',
        text: "We've hosted over 50 meetups on EventHub. The ticketing system is intuitive and the analytics help us understand our community better than ever.",
        rating: 5
    },
    {
        name: 'Priya Sharma',
        role: 'Marketing Head, InnovateFest',
        text: "The white-labeling feature lets us maintain our brand identity perfectly. Our attendees love the check-in experience. 10/10 would recommend!",
        rating: 5
    },
];

const whyUs = [
    { icon: Shield, title: 'Enterprise Security', desc: 'SOC2 compliant with end-to-end encryption' },
    { icon: Clock, title: '99.9% Uptime', desc: 'Reliable infrastructure that never lets you down' },
    { icon: Headphones, title: '24/7 Support', desc: 'Dedicated support team for all your needs' },
    { icon: Zap, title: 'Lightning Fast', desc: 'Optimized for speed with global CDN delivery' },
];

export default function Home() {
    return (
        <div className="home">
            {/* ====== HERO ====== */}
            <section className="hero">
                <div className="hero__bg">
                    <div className="hero__orb hero__orb--1" />
                    <div className="hero__orb hero__orb--2" />
                    <div className="hero__orb hero__orb--3" />
                    <div className="hero__grid-lines" />
                </div>

                <div className="container hero__content">
                    <motion.div initial="hidden" animate="visible" variants={fadeUp} className="hero__badge badge badge-primary">
                        <Zap size={14} /> AI-Powered Event Platform
                    </motion.div>

                    <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={1} className="hero__title">
                        Where Every Event <br />
                        <span className="text-gradient">Comes to Life</span>
                    </motion.h1>

                    <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={2} className="hero__subtitle">
                        The all-in-one platform for effortless event management, ticketing,
                        and attendee engagement. From intimate workshops to mega conferences.
                    </motion.p>

                    <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="hero__actions">
                        <Link to="/create-event" className="btn btn-primary btn-lg">
                            Host an Event <ArrowRight size={18} />
                        </Link>
                        <Link to="/contact" className="btn btn-secondary btn-lg">
                            Book a Demo
                        </Link>
                    </motion.div>

                </div>
            </section>

            {/* ====== STATS ====== */}
            <section className="stats-bar">
                <div className="container">
                    <div className="stats-bar__grid">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                className="stat-item"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeUp}
                                custom={i}
                            >
                                <stat.icon size={28} className="stat-item__icon" />
                                <div className="stat-item__value">{stat.value}</div>
                                <div className="stat-item__label">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ====== FEATURES ====== */}
            <section className="section features-section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-label">Features</span>
                        <h2 className="section-title">Everything You Need to<br /><span className="text-gradient">Run Amazing Events</span></h2>
                        <p className="section-desc">From ticketing to analytics, we've got every aspect of event management covered with AI-powered tools.</p>
                    </div>

                    <div className="features-grid">
                        {features.map((feature, i) => (
                            <motion.div
                                key={feature.title}
                                className="feature-card card"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeUp}
                                custom={i}
                            >
                                <div className="feature-card__icon" style={{ '--icon-color': feature.color }}>
                                    <feature.icon size={26} />
                                </div>
                                <h4 className="feature-card__title">{feature.title}</h4>
                                <p className="feature-card__desc">{feature.desc}</p>
                                <Link to="/features" className="feature-card__link">
                                    Learn more <ChevronRight size={16} />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ====== WHY US ====== */}
            <section className="section why-section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-label">EventHub</span>
                        <h2 className="section-title">Why Choose <span className="text-gradient">EventHub</span></h2>
                    </div>
                    <div className="why-grid">
                        {whyUs.map((item, i) => (
                            <motion.div
                                key={item.title}
                                className="why-card"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeUp}
                                custom={i}
                            >
                                <div className="why-card__icon"><item.icon size={24} /></div>
                                <h5>{item.title}</h5>
                                <p>{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ====== EVENT TYPES ====== */}
            <section className="section types-section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-label">Use Cases</span>
                        <h2 className="section-title">Solutions for <span className="text-gradient">Every Occasion</span></h2>
                        <p className="section-desc">Whether it's a tech conference or a marathon, EventHub has you covered.</p>
                    </div>

                    <div className="types-grid">
                        {eventTypes.map((type, i) => (
                            <motion.div
                                key={type.title}
                                className="type-card card"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeUp}
                                custom={i}
                            >
                                <div className="type-card__icon" style={{ '--type-color': type.color }}>
                                    <type.icon size={28} />
                                </div>
                                <h4>{type.title}</h4>
                                <p>{type.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ====== TESTIMONIALS ====== */}
            <section className="section testimonials-section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-label">Testimonials</span>
                        <h2 className="section-title">What Our Users <span className="text-gradient">Say About Us</span></h2>
                    </div>

                    <div className="testimonials-grid">
                        {testimonials.map((t, i) => (
                            <motion.div
                                key={t.name}
                                className="testimonial-card card"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeUp}
                                custom={i}
                            >
                                <div className="testimonial-card__stars">
                                    {[...Array(t.rating)].map((_, j) => <Star key={j} size={16} fill="#f59e0b" color="#f59e0b" />)}
                                </div>
                                <p className="testimonial-card__text">"{t.text}"</p>
                                <div className="testimonial-card__author">
                                    <div className="testimonial-card__avatar">{t.name.charAt(0)}</div>
                                    <div>
                                        <div className="testimonial-card__name">{t.name}</div>
                                        <div className="testimonial-card__role">{t.role}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ====== CTA ====== */}
            <section className="cta-section">
                <div className="cta-section__bg" />
                <div className="container cta-section__content">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                    >
                        <h2>Ready to Create <span className="text-gradient">Unforgettable Events</span>?</h2>
                        <p>Start hosting events effortlessly with EventHub. Free to get started, no credit card needed.</p>
                        <div className="cta-section__actions">
                            <Link to="/create-event" className="btn btn-primary btn-lg">
                                Get Started Free <ArrowRight size={18} />
                            </Link>
                            <Link to="/contact" className="btn btn-secondary btn-lg">
                                Book a Demo
                            </Link>
                        </div>
                        <div className="cta-section__features">
                            <span><CheckCircle2 size={16} /> Free to start</span>
                            <span><CheckCircle2 size={16} /> No credit card required</span>
                            <span><CheckCircle2 size={16} /> 24/7 support</span>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
