import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Building2, Eye, EyeOff, Zap, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 0) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }
    })
};

export default function Login() {
    const [isRegister, setIsRegister] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: '', email: '', password: '', company: '', role: 'user'
    });

    const { login, register, error, clearError } = useAuth();
    const navigate = useNavigate();

    const updateField = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        clearError();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isRegister) {
                await register(form.name, form.email, form.password, form.role);
            } else {
                await login(form.email, form.password);
            }
            navigate('/dashboard');
        } catch (err) {
            // Error is set in AuthContext
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsRegister(!isRegister);
        clearError();
    };

    return (
        <div className="login-page">
            <div className="login-bg">
                <div className="login-orb login-orb--1" />
                <div className="login-orb login-orb--2" />
                <div className="login-grid-lines" />
            </div>

            <div className="login-container">
                <motion.div className="login-card" initial="hidden" animate="visible" variants={fadeUp}>
                    {/* Logo */}
                    <div className="login-logo">
                        <div className="login-logo__icon"><Zap size={24} /></div>
                        <span>EventHub</span>
                    </div>

                    <h2>{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
                    <p className="login-subtitle">
                        {isRegister
                            ? 'Join EventHub and start hosting amazing events'
                            : 'Sign in to manage your events and registrations'
                        }
                    </p>

                    {error && (
                        <div className="login-error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="login-form">
                        {isRegister && (
                            <div className="form-group">
                                <label className="form-label"><User size={14} /> Full Name</label>
                                <input
                                    className="form-input"
                                    placeholder="John Doe"
                                    value={form.name}
                                    onChange={e => updateField('name', e.target.value)}
                                    required
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label"><Mail size={14} /> Email</label>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={e => updateField('email', e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label"><Lock size={14} /> Password</label>
                            <div className="password-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-input"
                                    placeholder={isRegister ? 'Min 6 characters' : 'Your password'}
                                    value={form.password}
                                    onChange={e => updateField('password', e.target.value)}
                                    required
                                    minLength={isRegister ? 6 : undefined}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {isRegister && (
                            <>
                                <div className="form-group">
                                    <label className="form-label"><Building2 size={14} /> Company (optional)</label>
                                    <input
                                        className="form-input"
                                        placeholder="Your company"
                                        value={form.company}
                                        onChange={e => updateField('company', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">I want to</label>
                                    <div className="role-buttons">
                                        <button
                                            type="button"
                                            className={`role-btn ${form.role === 'user' ? 'role-btn--active' : ''}`}
                                            onClick={() => updateField('role', 'user')}
                                        >
                                            Attend Events
                                        </button>
                                        <button
                                            type="button"
                                            className={`role-btn ${form.role === 'organizer' ? 'role-btn--active' : ''}`}
                                            onClick={() => updateField('role', 'organizer')}
                                        >
                                            Host Events
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary login-submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="login-spinner" />
                            ) : (
                                <>
                                    {isRegister ? 'Create Account' : 'Sign In'}
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="login-divider">
                        <span>or</span>
                    </div>

                    <p className="login-toggle">
                        {isRegister ? 'Already have an account?' : "Don't have an account?"}
                        <button type="button" className="login-toggle__btn" onClick={toggleMode}>
                            {isRegister ? 'Sign In' : 'Create Account'}
                        </button>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
