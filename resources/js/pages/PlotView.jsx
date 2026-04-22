import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { plots as plotsApi } from '../api';
import PlotMap from '../components/PlotMap';

export default function PlotView() {
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

    async function handleDelete() {
        if (!confirm(`Delete plot "${plot.name}"? This cannot be undone.`)) return;
        await plotsApi.delete(plot.id);
        navigate('/plots');
    }

    if (loading) return <p className="text-gray-500">Loading…</p>;
    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Link to="/plots" className="text-green-600 hover:underline text-sm">← Plots</Link>
                    <h1 className="text-2xl font-bold text-gray-800">{plot.name}</h1>
                </div>
                <div className="flex gap-3">
                    <Link
                        to={`/plots/${id}/edit`}
                        className="border border-green-600 text-green-700 px-4 py-2 rounded hover:bg-green-50 text-sm font-medium transition-colors"
                    >
                        Edit
                    </Link>
                    <button
                        onClick={handleDelete}
                        className="border border-red-400 text-red-600 px-4 py-2 rounded hover:bg-red-50 text-sm font-medium transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow p-4">
                        <PlotMap initialCoordinates={plot.coordinates} readOnly />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-white rounded-lg shadow p-5 space-y-4">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Category</p>
                            <p className="text-gray-800">{plot.category?.name ?? '—'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Description</p>
                            <p className="text-gray-700 whitespace-pre-wrap">{plot.description || '—'}</p>
                        </div>
                        <hr />
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Area</p>
                            <p className="text-2xl font-bold text-green-700">
                                {Number(plot.area_sqm).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                <span className="text-sm font-normal text-gray-500 ml-1">m²</span>
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Hectares</p>
                            <p className="text-2xl font-bold text-green-700">
                                {Number(plot.hectares).toLocaleString(undefined, { maximumFractionDigits: 6 })}
                                <span className="text-sm font-normal text-gray-500 ml-1">ha</span>
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Vertices</p>
                            <p className="text-gray-700">{plot.coordinates?.length ?? 0} points</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
