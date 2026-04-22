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
            <div className="d-flex align-items-center gap-2 mb-4">
                <Link to="/plots" className="btn btn-link text-success p-0 btn-sm">← Plots</Link>
                <h1 className="h3 mb-0">New Plot</h1>
            </div>
            <div className="card shadow-sm">
                <div className="card-body">
                    <PlotForm onSubmit={handleSubmit} submitLabel="Create Plot" />
                </div>
            </div>
        </div>
    );
}
