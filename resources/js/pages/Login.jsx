import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || 'Login failed');
                return;
            }
            login(data.token, data.user);
            navigate('/plots', { replace: true });
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div className="card shadow" style={{ width: '100%', maxWidth: 400 }}>
                <div className="card-body p-4">
                    <h4 className="card-title text-center mb-4 fw-bold">Sign in to Plotez</h4>
                    {error && <div className="alert alert-danger py-2">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={form.email}
                                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                required
                                autoFocus
                            />
                        </div>
                        <div className="mb-4">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={form.password}
                                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-success w-100"
                            disabled={loading}
                        >
                            {loading ? 'Signing in…' : 'Sign in'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
