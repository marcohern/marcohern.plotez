import React from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import PlotList from './pages/PlotList';
import PlotCreate from './pages/PlotCreate';
import PlotEdit from './pages/PlotEdit';
import PlotView from './pages/PlotView';
import CategoryList from './pages/CategoryList';

export default function Layout() {
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow-sm">
                <div className="container">
                    <span className="navbar-brand fw-bold fs-4">Plotez</span>
                    <div className="navbar-nav">
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
                </div>
            </nav>
            <main className="container py-4">
                <Routes>
                    <Route path="/" element={<Navigate to="/plots" replace />} />
                    <Route path="/plots" element={<PlotList />} />
                    <Route path="/plots/create" element={<PlotCreate />} />
                    <Route path="/plots/:id" element={<PlotView />} />
                    <Route path="/plots/:id/edit" element={<PlotEdit />} />
                    <Route path="/categories" element={<CategoryList />} />
                </Routes>
            </main>
        </>
    );
}
