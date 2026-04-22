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

    if (loading) return <p className="text-gray-500">Loading…</p>;
    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <Link to={`/plots/${id}`} className="text-green-600 hover:underline text-sm">← Back</Link>
                <h1 className="text-2xl font-bold text-gray-800">Edit: {plot.name}</h1>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
                <PlotForm initialData={plot} onSubmit={handleSubmit} submitLabel="Update Plot" />
            </div>
        </div>
    );
}
