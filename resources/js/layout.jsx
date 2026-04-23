import React from 'react';
import { Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './auth';
import PlotList from './pages/PlotList';
import PlotCreate from './pages/PlotCreate';
import PlotEdit from './pages/PlotEdit';
import PlotView from './pages/PlotView';
import CategoryList from './pages/CategoryList';
import Login from './pages/Login';

function RequireAuth({ children }) {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login', { replace: true });
    };

    if (!isAuthenticated) return null;

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow-sm">
            <div className="container">
                <span className="navbar-brand fw-bold fs-4">Plotez</span>
                <div className="navbar-nav me-auto">
                    <NavLink
                        to="/plots"
                        className={({ isActive }) => 'nav-link' + (isActive ? ' active fw-semibold' : '')}
                    >
                        Plots
                    </NavLink>
                    <NavLink
                        to="/categories"
                        className={({ isActive }) => 'nav-link' + (isActive ? ' active fw-semibold' : '')}
                    >
                        Categories
                    </NavLink>
                </div>
                <div className="d-flex align-items-center gap-3">
                    <span className="text-white opacity-75 small">{user?.name}</span>
                    <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default function Layout() {
    return (
        <>
            <Navbar />
            <main className="container py-4">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<RequireAuth><Navigate to="/plots" replace /></RequireAuth>} />
                    <Route path="/plots" element={<RequireAuth><PlotList /></RequireAuth>} />
                    <Route path="/plots/create" element={<RequireAuth><PlotCreate /></RequireAuth>} />
                    <Route path="/plots/:id" element={<RequireAuth><PlotView /></RequireAuth>} />
                    <Route path="/plots/:id/edit" element={<RequireAuth><PlotEdit /></RequireAuth>} />
                    <Route path="/categories" element={<RequireAuth><CategoryList /></RequireAuth>} />
                </Routes>
            </main>
        </>
    );
}
