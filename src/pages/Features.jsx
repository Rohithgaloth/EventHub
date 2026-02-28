import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Ticket, QrCode, Smartphone, Camera, Palette, BarChart3,
    Globe, Zap, Shield, Users, CalendarCheck, Mail, ArrowRight,
    Webhook, Award, Store, MonitorSmartphone, Scan, BadgeCheck,
    Printer, Brain, Network, Share2, CheckCircle2
} from 'lucide-react';
import './Features.css';

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 0) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }
    })
};

const featureCategories = [
    {
        label: 'PRE-EVENT',
        title: 'Before Your Event',
        desc: 'Set up your event for success with powerful pre-event tools.',
        color: '#6d10ff',
        features: [
            { icon: Palette, title: 'Event Website', desc: '3 stunning templates with custom branding, domains, and white-labeling.' },
            { icon: Ticket, title: 'Smart Ticketing', desc: 'Group discounts, hidden tickets, approval-based registrations, and multi-currency support.' },
            { icon: Mail, title: 'Email Campaigns', desc: 'Customizable email notifications, campaigns, and automated referral contests.' },
            { icon: Store, title: 'Exhibitor Portal', desc: 'Dedicated portal for sponsors and exhibitors to manage their presence.' },
        ]
    },
    {
        label: 'DURING EVENT',
        title: "At Your Event",
        desc: 'AI-powered tools for seamless on-ground event execution.',
        color: '#00d4ff',
        features: [
            { icon: Scan, title: 'AI Face Check-in', desc: 'Frictionless entry with AI face detection — no QR codes or tickets needed.' },
            { icon: Smartphone, title: 'Event App', desc: 'Full-featured mobile app with schedules, live updates, and lead capture.' },
            { icon: MonitorSmartphone, title: 'Self-Check-in Kiosk', desc: 'Touchscreen kiosk software for attendees to self-check-in and print badges.' },
            { icon: Printer, title: 'Badge Printing', desc: 'On-demand badge printing with custom designs and QR codes.' },
            { icon: Camera, title: 'AI Photo Booth', desc: 'AI-powered photo booth with avatar generation that attendees love to share.' },
            { icon: Network, title: 'AI Networking', desc: 'Smart attendee matching based on interests, roles, and goals.' },
        ]
    },
    {
        label: 'POST-EVENT',
        title: 'After Your Event',
        desc: 'Measure success and stay connected with your audience.',
        color: '#34d399',
        features: [
            { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Real-time insights on registrations, revenue, attendance, and engagement.' },
            { icon: Award, title: 'Certificates', desc: 'Automated participation certificates with custom designs and bulk delivery.' },
            { icon: Share2, title: 'Feedback & Surveys', desc: 'Collect attendee feedback with smart forms and NPS tracking.' },
            { icon: Camera, title: 'AI Photo Gallery', desc: 'Auto-organized event photo gallery with face recognition and sharing.' },
        ]
    },
    {
        label: 'INTEGRATIONS',
        title: 'Connect Everything',
        desc: 'Seamlessly integrate with your existing tech stack.',
        color: '#f59e0b',
        features: [
            { icon: Webhook, title: 'Webhooks & API', desc: 'REST APIs and webhooks for custom integrations and automation.' },
            { icon: Zap, title: 'Zapier', desc: 'Connect with 5,000+ apps through our Zapier integration.' },
            { icon: Globe, title: 'Registration Widget', desc: 'Embed registration on your website with our customizable widget.' },
            { icon: BadgeCheck, title: 'Martech Stack', desc: 'Direct integrations with HubSpot, Salesforce, Mailchimp, and more.' },
        ]
    }
];

export default function Features() {
    return (
        <div className="features-page">
            <section className="features-hero">
                <div className="features-hero__bg">
                    <div className="features-hero__orb features-hero__orb--1" />
                    <div className="features-hero__orb features-hero__orb--2" />
                </div>
                <div className="container features-hero__content">
                    <motion.span initial="hidden" animate="visible" variants={fadeUp} className="section-label">Features</motion.span>
                    <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={1}>
                        End-to-End Event<br /><span className="text-gradient">Tech Solution</span>
                    </motion.h1>
                    <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={2} className="features-hero__desc">
                        Every tool you need — from planning to post-event analytics — powered by AI.
                    </motion.p>
                </div>
            </section>

            {featureCategories.map((category, ci) => (
                <section key={category.label} className={`section feature-category ${ci % 2 === 0 ? 'feature-category--alt' : ''}`}>
                    <div className="container">
                        <motion.div className="section-header" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                            <span className="section-label" style={{ color: category.color }}>{category.label}</span>
                            <h2 className="section-title">{category.title}</h2>
                            <p className="section-desc">{category.desc}</p>
                        </motion.div>

                        <div className="feature-cat-grid">
                            {category.features.map((feature, i) => (
                                <motion.div
                                    key={feature.title}
                                    className="feature-detail-card card"
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={fadeUp}
                                    custom={i}
                                >
                                    <div className="feature-detail-card__icon" style={{ '--fd-color': category.color }}>
                                        <feature.icon size={24} />
                                    </div>
                                    <h4>{feature.title}</h4>
                                    <p>{feature.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            ))}

            {/* CTA */}
            <section className="features-cta">
                <div className="features-cta__bg" />
                <div className="container features-cta__content">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                        <h2>Ready to <span className="text-gradient">Get Started</span>?</h2>
                        <p>Create your first event in under 5 minutes — completely free.</p>
                        <div className="features-cta__actions">
                            <Link to="/create-event" className="btn btn-primary btn-lg">Start Free <ArrowRight size={18} /></Link>
                            <Link to="/contact" className="btn btn-secondary btn-lg">Book a Demo</Link>
                        </div>
                        <div className="features-cta__trust">
                            <span><CheckCircle2 size={16} /> No credit card</span>
                            <span><CheckCircle2 size={16} /> 14-day free trial</span>
                            <span><CheckCircle2 size={16} /> Cancel anytime</span>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
