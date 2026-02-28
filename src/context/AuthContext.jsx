import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load user from localStorage on mount
    useEffect(() => {
        const token = localStorage.getItem('eventhub_token');
        const savedUser = localStorage.getItem('eventhub_user');

        if (token && savedUser) {
            try {
                setUser(JSON.parse(savedUser));
                // Verify token is still valid
                authAPI.getProfile().then(res => {
                    setUser(res.data.user);
                    localStorage.setItem('eventhub_user', JSON.stringify(res.data.user));
                }).catch(() => {
                    // Token expired or invalid
                    logout();
                });
            } catch {
                logout();
            }
        }
        setLoading(false);
    }, []);

    const register = async (name, email, password, role = 'user') => {
        try {
            setError(null);
            const res = await authAPI.register({ name, email, password, role });
            const { token, user: userData } = res.data;

            localStorage.setItem('eventhub_token', token);
            localStorage.setItem('eventhub_user', JSON.stringify(userData));
            setUser(userData);

            return userData;
        } catch (err) {
            const msg = err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Registration failed';
            setError(msg);
            throw new Error(msg);
        }
    };

    const login = async (email, password) => {
        try {
            setError(null);
            const res = await authAPI.login({ email, password });
            const { token, user: userData } = res.data;

            localStorage.setItem('eventhub_token', token);
            localStorage.setItem('eventhub_user', JSON.stringify(userData));
            setUser(userData);

            return userData;
        } catch (err) {
            const msg = err.response?.data?.error || 'Login failed';
            setError(msg);
            throw new Error(msg);
        }
    };

    const logout = () => {
        localStorage.removeItem('eventhub_token');
        localStorage.removeItem('eventhub_user');
        setUser(null);
        setError(null);
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('eventhub_user', JSON.stringify(updatedUser));
    };

    const isAuthenticated = !!user;
    const isOrganizer = user?.role === 'organizer' || user?.role === 'admin';

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            error,
            isAuthenticated,
            isOrganizer,
            register,
            login,
            logout,
            updateUser,
            clearError: () => setError(null),
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
