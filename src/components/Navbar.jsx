import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Zap, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const links = [
    { to: '/', label: 'Home' },
    { to: '/features', label: 'Features' },
    { to: '/events', label: 'Events' },
    { to: '/pricing', label: 'Pricing' },
    ...(isAuthenticated ? [{ to: '/dashboard', label: 'Dashboard' }] : []),
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        <Link to="/" className="navbar__logo">
          <div className="navbar__logo-icon">
            <Zap size={22} />
          </div>
          <span className="navbar__logo-text">EventHub</span>
        </Link>

        <div className={`navbar__links ${mobileOpen ? 'navbar__links--open' : ''}`}>
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`navbar__link ${location.pathname === link.to ? 'navbar__link--active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
          {/* Mobile auth buttons */}
          <div className="navbar__mobile-auth">
            {isAuthenticated ? (
              <>
                <Link to="/create-event" className="btn btn-primary btn-sm">Host an Event</Link>
                <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">
                <LogIn size={16} /> Sign In
              </Link>
            )}
          </div>
        </div>

        <div className="navbar__actions">
          {isAuthenticated ? (
            <>
              <Link to="/create-event" className="btn btn-primary btn-sm navbar__cta">
                Host an Event
              </Link>
              <div className="navbar__user-menu">
                <button className="navbar__avatar" title={user?.name}>
                  {user?.name?.charAt(0)?.toUpperCase() || <User size={18} />}
                </button>
                <div className="navbar__dropdown">
                  <div className="navbar__dropdown-header">
                    <strong>{user?.name}</strong>
                    <span>{user?.email}</span>
                  </div>
                  <Link to="/dashboard" className="navbar__dropdown-item">Dashboard</Link>
                  <button className="navbar__dropdown-item" onClick={handleLogout}>
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm navbar__cta">
                Sign In
              </Link>
              <Link to="/create-event" className="btn btn-primary btn-sm navbar__cta">
                Host an Event
              </Link>
            </>
          )}
          <button
            className="navbar__hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
