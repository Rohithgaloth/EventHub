import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, Calendar, MapPin, Clock, Ticket, ImageIcon, Plus, Trash2, Upload } from 'lucide-react';
import { eventsAPI, uploadAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import './CreateEvent.css';

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 0) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }
    })
};

const steps = ['Basic Info', 'Date & Venue', 'Tickets', 'Review'];
const categories = ['Conference', 'Workshop', 'Hackathon', 'Meetup', 'Concert', 'Sports', 'Expo', 'Festival'];

export default function CreateEvent() {
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [coverFile, setCoverFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState('');
    const [form, setForm] = useState({
        title: '', description: '', category: '', type: 'in-person',
        date: '', endDate: '', time: '', endTime: '',
        venue: '', address: '', city: '', country: '',
        tickets: [{ name: 'General Admission', price: 0, quantity: 100, description: '' }],
    });

    const { user } = useAuth();
    const navigate = useNavigate();

    const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    const addTicket = () => setForm(prev => ({
        ...prev,
        tickets: [...prev.tickets, { name: '', price: 0, quantity: 100, description: '' }]
    }));

    const removeTicket = (i) => setForm(prev => ({
        ...prev,
        tickets: prev.tickets.filter((_, idx) => idx !== i)
    }));

    const updateTicket = (i, field, value) => setForm(prev => ({
        ...prev,
        tickets: prev.tickets.map((t, idx) => idx === i ? { ...t, [field]: value } : t)
    }));

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverFile(file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 0));

    const handlePublish = async () => {
        setLoading(true);
        setError('');

        try {
            // Upload cover image if selected
            let coverImage = '';
            if (coverFile) {
                try {
                    const uploadRes = await uploadAPI.upload(coverFile);
                    coverImage = uploadRes.data.url;
                } catch (e) {
                    console.log('Image upload skipped (server may not be running)');
                }
            }

            const eventData = {
                ...form,
                coverImage,
                date: form.date || new Date().toISOString(),
                tickets: form.tickets.map(t => ({
                    ...t,
                    price: Number(t.price) || 0,
                    quantity: Number(t.quantity) || 100,
                })),
            };

            const res = await eventsAPI.create(eventData);
            setSuccess(true);
            setTimeout(() => navigate(`/events/${res.data.event._id}`), 2000);
        } catch (err) {
            const msg = err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Failed to create event. Make sure the backend server is running.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="create-page">
                <section className="create-hero">
                    <div className="create-hero__bg"><div className="create-hero__orb create-hero__orb--1" /></div>
                    <div className="container create-hero__content" style={{ padding: '120px 0' }}>
                        <motion.div initial="hidden" animate="visible" variants={fadeUp} style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎉</div>
                            <h1>Event Published!</h1>
                            <p style={{ color: 'var(--neutral-400)', marginTop: '12px' }}>Your event is now live. Redirecting...</p>
                        </motion.div>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="create-page">
            <section className="create-hero">
                <div className="create-hero__bg">
                    <div className="create-hero__orb create-hero__orb--1" />
                </div>
                <div className="container create-hero__content">
                    <motion.h1 initial="hidden" animate="visible" variants={fadeUp}>
                        Create Your <span className="text-gradient">Event</span>
                    </motion.h1>
                    <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={1}>
                        Set up your event in minutes with our easy-to-use form.
                    </motion.p>
                </div>
            </section>

            <section className="section create-form-section">
                <div className="container" style={{ maxWidth: '820px' }}>
                    <div className="create-progress">
                        {steps.map((s, i) => (
                            <div key={s} className={`progress-step ${i <= step ? 'progress-step--active' : ''} ${i < step ? 'progress-step--done' : ''}`}>
                                <div className="progress-step__circle">
                                    {i < step ? <Check size={16} /> : i + 1}
                                </div>
                                <span className="progress-step__label">{s}</span>
                                {i < steps.length - 1 && <div className="progress-step__line" />}
                            </div>
                        ))}
                    </div>

                    {error && (
                        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', padding: '14px', marginBottom: '20px', color: '#f87171', fontSize: '0.9rem', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    <div className="create-form card">
                        {step === 0 && (
                            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
                                <h3>Basic Information</h3>
                                <div className="form-group">
                                    <label className="form-label">Event Title *</label>
                                    <input className="form-input" placeholder="Enter your event title" value={form.title} onChange={e => updateField('title', e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Description *</label>
                                    <textarea className="form-input" placeholder="Describe your event..." rows={5} value={form.description} onChange={e => updateField('description', e.target.value)} />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Category *</label>
                                        <select className="form-input" value={form.category} onChange={e => updateField('category', e.target.value)}>
                                            <option value="">Select category</option>
                                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Event Type</label>
                                        <div className="type-buttons">
                                            {['in-person', 'virtual', 'hybrid'].map(t => (
                                                <button key={t} className={`type-btn ${form.type === t ? 'type-btn--active' : ''}`} onClick={() => updateField('type', t)}>
                                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Cover Image</label>
                                    <label className="upload-area" htmlFor="cover-upload">
                                        {coverPreview ? (
                                            <img src={coverPreview} alt="Cover preview" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '12px' }} />
                                        ) : (
                                            <>
                                                <ImageIcon size={32} />
                                                <p>Drag & drop or click to upload</p>
                                                <span>PNG, JPG up to 5MB</span>
                                            </>
                                        )}
                                        <input type="file" id="cover-upload" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                                    </label>
                                </div>
                            </motion.div>
                        )}

                        {step === 1 && (
                            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
                                <h3>Date, Time & Venue</h3>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label"><Calendar size={14} /> Start Date *</label>
                                        <input type="date" className="form-input" value={form.date} onChange={e => updateField('date', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label"><Calendar size={14} /> End Date</label>
                                        <input type="date" className="form-input" value={form.endDate} onChange={e => updateField('endDate', e.target.value)} />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label"><Clock size={14} /> Start Time</label>
                                        <input type="time" className="form-input" value={form.time} onChange={e => updateField('time', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label"><Clock size={14} /> End Time</label>
                                        <input type="time" className="form-input" value={form.endTime} onChange={e => updateField('endTime', e.target.value)} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label"><MapPin size={14} /> Venue Name</label>
                                    <input className="form-input" placeholder="e.g. Moscone Center" value={form.venue} onChange={e => updateField('venue', e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Address</label>
                                    <input className="form-input" placeholder="Street address" value={form.address} onChange={e => updateField('address', e.target.value)} />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">City</label>
                                        <input className="form-input" placeholder="City" value={form.city} onChange={e => updateField('city', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Country</label>
                                        <input className="form-input" placeholder="Country" value={form.country} onChange={e => updateField('country', e.target.value)} />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
                                <h3>Ticket Tiers</h3>
                                {form.tickets.map((ticket, i) => (
                                    <div key={i} className="ticket-form-card">
                                        <div className="ticket-form-card__header">
                                            <span className="badge badge-accent"><Ticket size={12} /> Tier {i + 1}</span>
                                            {form.tickets.length > 1 && (
                                                <button className="ticket-remove" onClick={() => removeTicket(i)}><Trash2 size={16} /></button>
                                            )}
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label className="form-label">Ticket Name</label>
                                                <input className="form-input" placeholder="e.g. General Admission" value={ticket.name} onChange={e => updateTicket(i, 'name', e.target.value)} />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Price ($)</label>
                                                <input type="number" className="form-input" placeholder="0 for free" value={ticket.price} onChange={e => updateTicket(i, 'price', e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label className="form-label">Quantity</label>
                                                <input type="number" className="form-input" placeholder="Number of tickets" value={ticket.quantity} onChange={e => updateTicket(i, 'quantity', e.target.value)} />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Description</label>
                                                <input className="form-input" placeholder="Brief description" value={ticket.description} onChange={e => updateTicket(i, 'description', e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button className="btn btn-secondary add-ticket-btn" onClick={addTicket}>
                                    <Plus size={16} /> Add Another Tier
                                </button>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
                                <h3>Review & Publish</h3>
                                <div className="review-sections">
                                    <div className="review-card">
                                        <h5>Event Details</h5>
                                        <div className="review-field"><span>Title:</span><strong>{form.title || 'Not set'}</strong></div>
                                        <div className="review-field"><span>Category:</span><strong>{form.category || 'Not set'}</strong></div>
                                        <div className="review-field"><span>Type:</span><strong>{form.type}</strong></div>
                                    </div>
                                    <div className="review-card">
                                        <h5>Date & Venue</h5>
                                        <div className="review-field"><span>Date:</span><strong>{form.date || 'Not set'} — {form.endDate || 'Not set'}</strong></div>
                                        <div className="review-field"><span>Time:</span><strong>{form.time || 'Not set'} — {form.endTime || 'Not set'}</strong></div>
                                        <div className="review-field"><span>Venue:</span><strong>{form.venue || 'Not set'}, {form.city || ''}</strong></div>
                                    </div>
                                    <div className="review-card">
                                        <h5>Tickets ({form.tickets.length} tier{form.tickets.length > 1 ? 's' : ''})</h5>
                                        {form.tickets.map((t, i) => (
                                            <div key={i} className="review-field">
                                                <span>{t.name || `Tier ${i + 1}`}:</span>
                                                <strong>${t.price || '0'} × {t.quantity || '0'}</strong>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <div className="create-nav">
                            {step > 0 && (
                                <button className="btn btn-secondary" onClick={prevStep}>
                                    <ArrowLeft size={16} /> Back
                                </button>
                            )}
                            <div style={{ flex: 1 }} />
                            {step < 3 ? (
                                <button className="btn btn-primary" onClick={nextStep}>
                                    Continue <ArrowRight size={16} />
                                </button>
                            ) : (
                                <button className="btn btn-primary btn-lg" onClick={handlePublish} disabled={loading}>
                                    {loading ? 'Publishing...' : 'Publish Event 🚀'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
