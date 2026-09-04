import { Link } from 'react-router-dom';
import { Zap, Mail, MapPin, Phone, Code2, MessageCircle, BriefcaseBusiness, Camera } from 'lucide-react';
import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer__glow" />
            <div className="container">
                <div className="footer__grid">
                    <div className="footer__brand">
                        <Link to="/" className="footer__logo">
                            <div className="footer__logo-icon">
                                <Zap size={20} />
                            </div>
                            <span>EventHub</span>
                        </Link>
                        <p className="footer__desc">
                            The all-in-one AI-powered platform for effortless event management, ticketing, and attendee engagement.
                        </p>
                        <div className="footer__socials">
                            <a href="#" className="footer__social" aria-label="Twitter"><MessageCircle size={18} /></a>
                            <a href="#" className="footer__social" aria-label="LinkedIn"><BriefcaseBusiness size={18} /></a>
                            <a href="#" className="footer__social" aria-label="Instagram"><Camera size={18} /></a>
                            <a href="#" className="footer__social" aria-label="Code"><Code2 size={18} /></a>
                        </div>
                    </div>

                    <div className="footer__col">
                        <h4 className="footer__col-title">Product</h4>
                        <Link to="/features" className="footer__link">Features</Link>
                        <Link to="/pricing" className="footer__link">Pricing</Link>
                        <Link to="/events" className="footer__link">Events</Link>
                        <Link to="/create-event" className="footer__link">Host an Event</Link>
                    </div>

                    <div className="footer__col">
                        <h4 className="footer__col-title">Company</h4>
                        <Link to="/contact" className="footer__link">About Us</Link>
                        <Link to="/contact" className="footer__link">Contact</Link>
                        <Link to="/contact" className="footer__link">Careers</Link>
                        <Link to="/contact" className="footer__link">Blog</Link>
                    </div>

                    <div className="footer__col">
                        <h4 className="footer__col-title">Support</h4>
                        <Link to="/contact" className="footer__link">Help Center</Link>
                        <Link to="/contact" className="footer__link">Privacy Policy</Link>
                        <Link to="/contact" className="footer__link">Terms of Service</Link>
                        <Link to="/contact" className="footer__link">API Docs</Link>
                    </div>

                    <div className="footer__col">
                        <h4 className="footer__col-title">Contact Info</h4>
                        <div className="footer__contact-item">
                            <Mail size={16} />
                            <span>hello@eventhub.com</span>
                        </div>
                        <div className="footer__contact-item">
                            <Phone size={16} />
                            <span>+1 (555) 123-4567</span>
                        </div>
                        <div className="footer__contact-item">
                            <MapPin size={16} />
                            <span>San Francisco, CA</span>
                        </div>
                    </div>
                </div>

                <div className="footer__bottom">
                    <p>&copy; 2026 EventHub. All rights reserved.</p>
                    <p>Built with ❤️ for event organizers worldwide</p>
                </div>
            </div>
        </footer>
    );
}
