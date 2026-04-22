import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { plots as plotsApi } from '../api';
import PlotForm from '../components/PlotForm';

export default function PlotEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [plot, setPlot] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        plotsApi.get(id)
            .then(setPlot)
            .catch(() => setError('Plot not found.'))
            .finally(() => setLoading(false));
    }, [id]);

    async function handleSubmit(data) {
        await plotsApi.update(id, data);
        navigate(`/plots/${id}`);
    }

    if (loading) return <p className="text-muted">Loading…</p>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div>
            <div className="d-flex align-items-center gap-2 mb-4">
                <Link to={`/plots/${id}`} className="btn btn-link text-success p-0 btn-sm">← Back</Link>
                <h1 className="h3 mb-0">Edit: {plot.name}</h1>
            </div>
            <div className="card shadow-sm">
                <div className="card-body">
                    <PlotForm initialData={plot} onSubmit={handleSubmit} submitLabel="Update Plot" />
                </div>
            </div>
        </div>
    );
}
