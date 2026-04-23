import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem('api_token'));
    const [user, setUser] = useState(() => {
        const raw = localStorage.getItem('api_user');
        return raw ? JSON.parse(raw) : null;
    });

    const login = useCallback((token, user) => {
        localStorage.setItem('api_token', token);
        localStorage.setItem('api_user', JSON.stringify(user));
        setToken(token);
        setUser(user);
    }, []);

    const logout = useCallback(async () => {
        const t = localStorage.getItem('api_token');
        if (t) {
            await fetch('/api/logout', {
                method: 'POST',
                headers: { Authorization: `Bearer ${t}`, Accept: 'application/json' },
            }).catch(() => {});
        }
        localStorage.removeItem('api_token');
        localStorage.removeItem('api_user');
        setToken(null);
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
