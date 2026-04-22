import React from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import PlotList from './pages/PlotList';
import PlotCreate from './pages/PlotCreate';
import PlotEdit from './pages/PlotEdit';
import PlotView from './pages/PlotView';
import CategoryList from './pages/CategoryList';

export default function Layout() {
    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-green-700 text-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-8">
                    <span className="text-2xl font-bold tracking-wide">Plotez</span>
                    <NavLink
                        to="/plots"
                        className={({ isActive }) =>
                            'text-sm font-medium hover:text-green-200 transition-colors' +
                            (isActive ? ' underline underline-offset-4' : '')
                        }
                    >
                        Plots
                    </NavLink>
                    <NavLink
                        to="/categories"
                        className={({ isActive }) =>
                            'text-sm font-medium hover:text-green-200 transition-colors' +
                            (isActive ? ' underline underline-offset-4' : '')
                        }
                    >
                        Categories
                    </NavLink>
                </div>
            </nav>
            <main className="max-w-7xl mx-auto px-4 py-8">
                <Routes>
                    <Route path="/" element={<Navigate to="/plots" replace />} />
                    <Route path="/plots" element={<PlotList />} />
                    <Route path="/plots/create" element={<PlotCreate />} />
                    <Route path="/plots/:id" element={<PlotView />} />
                    <Route path="/plots/:id/edit" element={<PlotEdit />} />
                    <Route path="/categories" element={<CategoryList />} />
                </Routes>
            </main>
        </div>
    );
}
