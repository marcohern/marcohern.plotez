import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { plots as plotsApi } from '../api';
import PlotForm from '../components/PlotForm';

export default function PlotCreate() {
    const navigate = useNavigate();

    async function handleSubmit(data) {
        const plot = await plotsApi.create(data);
        navigate(`/plots/${plot.id}`);
    }

    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <Link to="/plots" className="text-green-600 hover:underline text-sm">← Plots</Link>
                <h1 className="text-2xl font-bold text-gray-800">New Plot</h1>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
                <PlotForm onSubmit={handleSubmit} submitLabel="Create Plot" />
            </div>
        </div>
    );
}
