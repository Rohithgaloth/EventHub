import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, X, Zap, ArrowRight, HelpCircle } from 'lucide-react';
import './Pricing.css';

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 0) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }
    })
};

const plans = [
    {
        name: 'Freemium',
        price: '0%',
        priceLabel: 'Free tickets only',
        desc: 'Perfect for getting started with free events',
        popular: false,
        features: [
            { text: 'Up to 100 registrations per event', included: true },
            { text: 'Ticket PDF with QR Code', included: true },
            { text: 'Download participant list', included: true },
            { text: 'Standard email notifications', included: true },
            { text: 'Default event template', included: true },
            { text: 'Analytics dashboard', included: false },
            { text: 'Custom branding', included: false },
            { text: 'Check-in app', included: false },
            { text: 'API access', included: false },
        ]
    },
    {
        name: 'Lite',
        price: '2%',
        priceLabel: '+18% GST · Nothing extra',
        desc: 'Great for small events and meetups',
        popular: false,
        features: [
            { text: 'Up to 300 registrations per event', included: true },
            { text: 'UPI payment method', included: true },
            { text: 'Analytics dashboard', included: true },
            { text: 'Unlimited discount codes', included: true },
            { text: 'Team-based registrations', included: true },
            { text: 'Waitlisted attendees', included: true },
            { text: 'Basic check-in app', included: true },
            { text: 'Email support', included: true },
            { text: 'Custom branding', included: false },
        ]
    },
    {
        name: 'Silver',
        price: '3.75%',
        priceLabel: '+18% GST · All payment methods',
        desc: 'Ideal for mid-sized conferences & events',
        popular: true,
        features: [
            { text: 'Up to 2,500 registrations', included: true },
            { text: 'All payment methods supported', included: true },
            { text: 'Approval-based registrations', included: true },
            { text: 'Group discounts & categories', included: true },
            { text: 'Custom email campaigns (10)', included: true },
            { text: 'Automated referral contests', included: true },
            { text: '3 event page templates', included: true },
            { text: 'Webhook & API access', included: true },
            { text: 'Phone & email support', included: true },
        ]
    },
    {
        name: 'Gold',
        price: 'Custom',
        priceLabel: 'Tailor-made pricing',
        desc: 'Enterprise solution for large-scale events',
        popular: false,
        features: [
            { text: 'Unlimited attendees & events', included: true },
            { text: 'Full white-labeling', included: true },
            { text: 'Custom sender email', included: true },
            { text: 'AI Photo Booth & Gallery', included: true },
            { text: 'AI Networking', included: true },
            { text: 'Exhibitor portal', included: true },
            { text: 'Event CMS / API', included: true },
            { text: 'Zapier integration', included: true },
            { text: 'Priority 24/7 support', included: true },
        ]
    }
];

const faqs = [
    { q: 'Can I switch plans later?', a: 'Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately.' },
    { q: 'Is there a free trial for paid plans?', a: 'Yes! All paid plans come with a 14-day free trial. No credit card required.' },
    { q: 'What payment methods are supported?', a: 'We support UPI, credit/debit cards, net banking, wallets, and international payments via Stripe.' },
    { q: 'Can I get a custom quote for my organization?', a: 'Of course! Contact our sales team for a tailored pricing plan that fits your specific needs.' },
];

export default function Pricing() {
    const [openFaq, setOpenFaq] = useState(null);

    return (
        <div className="pricing-page">
            {/* Hero */}
            <section className="pricing-hero">
                <div className="pricing-hero__bg">
                    <div className="pricing-hero__orb pricing-hero__orb--1" />
                    <div className="pricing-hero__orb pricing-hero__orb--2" />
                </div>
                <div className="container pricing-hero__content">
                    <motion.span initial="hidden" animate="visible" variants={fadeUp} className="section-label">Pricing</motion.span>
                    <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={1}>
                        Tailored Pricing to<br /><span className="text-gradient">Fuel Your Growth</span>
                    </motion.h1>
                    <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={2} className="pricing-hero__desc">
                        Start for free and scale as you grow. Our plans are designed to maximize your event profits.
                    </motion.p>
                </div>
            </section>

            {/* Plans */}
            <section className="section pricing-plans">
                <div className="container">
                    <div className="pricing-grid">
                        {plans.map((plan, i) => (
                            <motion.div
                                key={plan.name}
                                className={`pricing-card ${plan.popular ? 'pricing-card--popular' : ''}`}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeUp}
                                custom={i}
                            >
                                {plan.popular && <div className="pricing-card__badge">Most Popular</div>}
                                <div className="pricing-card__header">
                                    <h3>{plan.name}</h3>
                                    <div className="pricing-card__price">{plan.price}</div>
                                    <span className="pricing-card__price-label">{plan.priceLabel}</span>
                                    <p className="pricing-card__desc">{plan.desc}</p>
                                </div>
                                <div className="pricing-card__features">
                                    {plan.features.map((f, j) => (
                                        <div key={j} className={`pricing-feature ${!f.included ? 'pricing-feature--disabled' : ''}`}>
                                            {f.included ? <Check size={16} className="pricing-feature__icon--check" /> : <X size={16} className="pricing-feature__icon--x" />}
                                            <span>{f.text}</span>
                                        </div>
                                    ))}
                                </div>
                                <Link to="/create-event" className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'} pricing-card__btn`}>
                                    {plan.name === 'Gold' ? 'Contact Sales' : 'Get Started'}
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="section pricing-faq">
                <div className="container" style={{ maxWidth: '720px' }}>
                    <div className="section-header">
                        <span className="section-label">FAQ</span>
                        <h2 className="section-title">Frequently Asked <span className="text-gradient">Questions</span></h2>
                    </div>
                    <div className="faq-list">
                        {faqs.map((faq, i) => (
                            <motion.div
                                key={i}
                                className={`faq-item ${openFaq === i ? 'faq-item--open' : ''}`}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeUp}
                                custom={i}
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                            >
                                <div className="faq-item__question">
                                    <HelpCircle size={18} />
                                    <span>{faq.q}</span>
                                    <span className="faq-item__toggle">{openFaq === i ? '−' : '+'}</span>
                                </div>
                                {openFaq === i && <div className="faq-item__answer">{faq.a}</div>}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
