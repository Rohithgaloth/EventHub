import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import './Contact.css';

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 0) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }
    })
};

const contactCards = [
    { icon: Mail, title: 'Email Us', desc: 'hello@eventhub.com', sub: 'We reply within 24 hours' },
    { icon: Phone, title: 'Call Us', desc: '+1 (555) 123-4567', sub: 'Mon-Fri, 9AM-7PM PST' },
    { icon: MapPin, title: 'Visit Us', desc: '100 Market St, SF', sub: 'San Francisco, CA 94105' },
    { icon: MessageSquare, title: 'Live Chat', desc: 'Start a conversation', sub: 'Available 24/7' },
];

const faqs = [
    { q: 'How do I create my first event?', a: 'Sign up for free, click "Host an Event", and follow our simple 4-step wizard. You can have your event page live in under 5 minutes!' },
    { q: 'What payment methods do you support?', a: 'We support UPI, credit/debit cards, net banking, digital wallets, and international payments through Stripe and Razorpay.' },
    { q: 'Can I customize my event page?', a: 'Absolutely! Silver and Gold plans offer 3 premium templates, white-labeling, custom domains, and full branding customization.' },
    { q: 'How does the AI check-in work?', a: 'Our AI uses face detection to verify attendees at check-in. Simply snap a photo during registration, and our system matches faces at the venue for seamless entry.' },
    { q: 'Do you offer refunds?', a: 'Refund policies are set by event organizers. As a platform, we facilitate the refund process and ensure secure transactions for all parties.' },
    { q: 'Can I integrate with other tools?', a: 'Yes! We offer Zapier integration, webhooks, REST APIs, and direct Martech integrations for seamless connectivity with your existing tools.' },
];

export default function Contact() {
    const [openFaq, setOpenFaq] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', company: '', subject: '', message: '' });

    const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    return (
        <div className="contact-page">
            {/* Hero */}
            <section className="contact-hero">
                <div className="contact-hero__bg">
                    <div className="contact-hero__orb contact-hero__orb--1" />
                    <div className="contact-hero__orb contact-hero__orb--2" />
                </div>
                <div className="container contact-hero__content">
                    <motion.span initial="hidden" animate="visible" variants={fadeUp} className="section-label">Contact Us</motion.span>
                    <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={1}>
                        Let's Build Something <span className="text-gradient">Amazing Together</span>
                    </motion.h1>
                    <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={2} className="contact-hero__desc">
                        Have questions? Want a demo? We'd love to hear from you. Our team is ready to help.
                    </motion.p>
                </div>
            </section>

            {/* Contact Cards */}
            <section className="contact-cards-section">
                <div className="container">
                    <div className="contact-cards-grid">
                        {contactCards.map((card, i) => (
                            <motion.div key={card.title} className="contact-info-card card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                                <div className="contact-info-card__icon">
                                    <card.icon size={22} />
                                </div>
                                <h4>{card.title}</h4>
                                <p className="contact-info-card__main">{card.desc}</p>
                                <p className="contact-info-card__sub">{card.sub}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form + Demo */}
            <section className="section contact-form-section">
                <div className="container">
                    <div className="contact-layout">
                        {/* Form */}
                        <motion.div className="contact-form card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                            <h3>Send Us a Message</h3>
                            <p className="contact-form__desc">Fill out the form below and we'll get back to you within 24 hours.</p>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Full Name *</label>
                                    <input className="form-input" placeholder="John Doe" value={formData.name} onChange={e => updateField('name', e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email *</label>
                                    <input type="email" className="form-input" placeholder="john@company.com" value={formData.email} onChange={e => updateField('email', e.target.value)} />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Company</label>
                                    <input className="form-input" placeholder="Your company" value={formData.company} onChange={e => updateField('company', e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Subject</label>
                                    <select className="form-input" value={formData.subject} onChange={e => updateField('subject', e.target.value)}>
                                        <option value="">Select a topic</option>
                                        <option>General Inquiry</option>
                                        <option>Book a Demo</option>
                                        <option>Pricing Question</option>
                                        <option>Partnership</option>
                                        <option>Technical Support</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Message *</label>
                                <textarea className="form-input" placeholder="How can we help you?" rows={5} value={formData.message} onChange={e => updateField('message', e.target.value)} />
                            </div>
                            <button className="btn btn-primary contact-submit">
                                <Send size={16} /> Send Message
                            </button>
                        </motion.div>

                        {/* Demo */}
                        <motion.div className="demo-section" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
                            <div className="demo-card card">
                                <div className="demo-card__badge badge badge-accent">
                                    <Clock size={12} /> 30 min
                                </div>
                                <h3>Book a Live Demo</h3>
                                <p>See EventHub in action with a personalized walkthrough from our team.</p>
                                <ul className="demo-features">
                                    <li>✓ Personalized platform tour</li>
                                    <li>✓ Custom pricing discussion</li>
                                    <li>✓ Q&A with our experts</li>
                                    <li>✓ Free trial activation</li>
                                </ul>
                                <a href="https://calendly.com" target="_blank" rel="noopener noreferrer" className="btn btn-primary demo-btn">
                                    Schedule a Demo
                                </a>
                            </div>

                            <div className="office-card card">
                                <h4>Our Office</h4>
                                <div className="office-map">
                                    <MapPin size={32} />
                                    <p>100 Market Street</p>
                                    <p>San Francisco, CA 94105</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="section contact-faq">
                <div className="container" style={{ maxWidth: '760px' }}>
                    <div className="section-header">
                        <span className="section-label">FAQ</span>
                        <h2 className="section-title">Common <span className="text-gradient">Questions</span></h2>
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
                                    <span className="faq-item__toggle">
                                        {openFaq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                    </span>
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
