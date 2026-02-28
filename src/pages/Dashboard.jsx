import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    BarChart3, Users, DollarSign, CalendarCheck, TrendingUp,
    ArrowUpRight, ArrowDownRight, Eye, Clock, Plus, MoreHorizontal
} from 'lucide-react';
import { dashboardAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 0) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }
    })
};

// Fallback data
const fallbackSummary = [
    { title: 'Total Events', value: '24', change: '+3 this month', trend: 'up', icon: CalendarCheck, color: '#6d10ff' },
    { title: 'Total Registrations', value: '12,847', change: '+18% vs last month', trend: 'up', icon: Users, color: '#00d4ff' },
    { title: 'Revenue', value: '$48,290', change: '+23% vs last month', trend: 'up', icon: DollarSign, color: '#34d399' },
    { title: 'Avg. Satisfaction', value: '4.8/5', change: '+0.2 improvement', trend: 'up', icon: TrendingUp, color: '#f59e0b' },
];

const fallbackEvents = [
    { _id: '1', title: 'Global Tech Summit 2026', date: '2026-03-15', totalRegistrations: 4821, totalRevenue: 28400, status: 'active' },
    { _id: '2', title: 'AI Workshop Series', date: '2026-04-05', totalRegistrations: 183, totalRevenue: 8967, status: 'upcoming' },
    { _id: '3', title: 'DevOps Meetup #12', date: '2026-02-20', totalRegistrations: 145, totalRevenue: 0, status: 'completed' },
    { _id: '4', title: 'Cloud Native Conf', date: '2026-05-25', totalRegistrations: 2100, totalRevenue: 12500, status: 'upcoming' },
    { _id: '5', title: 'Hack the Future', date: '2026-04-20', totalRegistrations: 892, totalRevenue: 0, status: 'upcoming' },
];

const fallbackChart = [
    { month: 'Sep', value: 30 },
    { month: 'Oct', value: 45 },
    { month: 'Nov', value: 35 },
    { month: 'Dec', value: 55 },
    { month: 'Jan', value: 65 },
    { month: 'Feb', value: 80 },
];

export default function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [recentEvents, setRecentEvents] = useState(fallbackEvents);
    const [chartData, setChartData] = useState(fallbackChart);
    const [summaryCards, setSummaryCards] = useState(fallbackSummary);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const [statsRes, eventsRes, chartRes] = await Promise.all([
                dashboardAPI.getStats(),
                dashboardAPI.getRecentEvents(),
                dashboardAPI.getRevenueChart(),
            ]);

            const s = statsRes.data;
            setSummaryCards([
                { title: 'Total Events', value: String(s.totalEvents), change: s.changes.events, trend: 'up', icon: CalendarCheck, color: '#6d10ff' },
                { title: 'Total Registrations', value: s.totalRegistrations.toLocaleString(), change: s.changes.registrations, trend: 'up', icon: Users, color: '#00d4ff' },
                { title: 'Revenue', value: `$${s.totalRevenue.toLocaleString()}`, change: s.changes.revenue, trend: 'up', icon: DollarSign, color: '#34d399' },
                { title: 'Avg. Satisfaction', value: `${s.avgSatisfaction}/5`, change: '+0.2 improvement', trend: 'up', icon: TrendingUp, color: '#f59e0b' },
            ]);

            setRecentEvents(eventsRes.data.events);

            if (chartRes.data.chartData.length > 0) {
                const maxVal = Math.max(...chartRes.data.chartData.map(d => d.value), 1);
                setChartData(chartRes.data.chartData.map(d => ({
                    ...d,
                    value: Math.round((d.value / maxVal) * 100) || 5,
                })));
            }
        } catch (err) {
            // Backend not available, use fallback data
            console.log('Dashboard: using fallback data (backend not available)');
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="dashboard">
            <section className="dashboard-header">
                <div className="container">
                    <div className="dashboard-header__top">
                        <div>
                            <h1>Dashboard</h1>
                            <p>Welcome back{user ? `, ${user.name}` : ''}! Here's your event overview.</p>
                        </div>
                        <Link to="/create-event" className="btn btn-primary">
                            <Plus size={18} /> Create Event
                        </Link>
                    </div>
                </div>
            </section>

            <section className="dashboard-body">
                <div className="container">
                    <div className="summary-grid">
                        {summaryCards.map((card, i) => (
                            <motion.div key={card.title} className="summary-card card" initial="hidden" animate="visible" variants={fadeUp} custom={i}>
                                <div className="summary-card__header">
                                    <div className="summary-card__icon" style={{ '--sc-color': card.color }}>
                                        <card.icon size={20} />
                                    </div>
                                    <span className="summary-card__trend summary-card__trend--up">
                                        <ArrowUpRight size={14} />
                                    </span>
                                </div>
                                <div className="summary-card__value">{card.value}</div>
                                <div className="summary-card__title">{card.title}</div>
                                <div className="summary-card__change">{card.change}</div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="dashboard-grid">
                        <motion.div className="chart-card card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                            <div className="chart-card__header">
                                <h4>Revenue Overview</h4>
                                <select className="chart-select">
                                    <option>Last 6 months</option>
                                    <option>Last 12 months</option>
                                </select>
                            </div>
                            <div className="chart-visual">
                                {chartData.map((d) => (
                                    <div key={d.month} className="chart-bar-wrapper">
                                        <div className="chart-bar" style={{ height: `${d.value}%` }}>
                                            <span className="chart-bar__tooltip">${(d.value * 600).toLocaleString()}</span>
                                        </div>
                                        <span className="chart-bar__label">{d.month}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div className="quick-actions card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
                            <h4>Quick Actions</h4>
                            <div className="quick-actions__list">
                                <Link to="/create-event" className="quick-action"><Plus size={18} /> Create New Event</Link>
                                <Link to="/events" className="quick-action"><Eye size={18} /> View All Events</Link>
                                <Link to="/contact" className="quick-action"><Users size={18} /> Manage Attendees</Link>
                                <Link to="/pricing" className="quick-action"><BarChart3 size={18} /> View Analytics</Link>
                            </div>
                            <h4 style={{ marginTop: 28 }}>Upcoming Events</h4>
                            <div className="upcoming-list">
                                {recentEvents.filter(e => e.status === 'upcoming').slice(0, 3).map(event => (
                                    <div key={event._id} className="upcoming-item">
                                        <div className="upcoming-item__dot" />
                                        <div>
                                            <div className="upcoming-item__name">{event.title}</div>
                                            <div className="upcoming-item__date"><Clock size={12} /> {formatDate(event.date)}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    <motion.div className="events-table card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                        <div className="events-table__header">
                            <h4>Recent Events</h4>
                            <Link to="/events" className="btn btn-secondary btn-sm">View All</Link>
                        </div>
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Event Name</th>
                                        <th>Date</th>
                                        <th>Registrations</th>
                                        <th>Revenue</th>
                                        <th>Status</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentEvents.map(event => (
                                        <tr key={event._id}>
                                            <td className="table-event-name">{event.title}</td>
                                            <td>{formatDate(event.date)}</td>
                                            <td>{(event.totalRegistrations || 0).toLocaleString()}</td>
                                            <td className="table-revenue">{event.totalRevenue ? `$${event.totalRevenue.toLocaleString()}` : 'Free'}</td>
                                            <td>
                                                <span className={`status-badge status-badge--${event.status}`}>
                                                    {event.status}
                                                </span>
                                            </td>
                                            <td>
                                                <button className="table-action"><MoreHorizontal size={16} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
