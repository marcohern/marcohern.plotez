import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { plots as plotsApi } from '../api';

export default function PlotList() {
    const [plots, setPlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        plotsApi.list()
            .then(setPlots)
            .catch(() => setError('Failed to load plots.'))
            .finally(() => setLoading(false));
    }, []);

    async function handleDelete(plot) {
        if (!confirm(`Delete plot "${plot.name}"? This cannot be undone.`)) return;
        setDeleting(plot.id);
        try {
            await plotsApi.delete(plot.id);
            setPlots(prev => prev.filter(p => p.id !== plot.id));
        } catch {
            alert('Failed to delete plot.');
        } finally {
            setDeleting(null);
        }
    }

    if (loading) return <p className="text-gray-500">Loading plots...</p>;
    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Plots of Terrain</h1>
                <Link
                    to="/plots/create"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors text-sm font-medium"
                >
                    + New Plot
                </Link>
            </div>

            {plots.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <p className="text-lg">No plots yet.</p>
                    <Link to="/plots/create" className="text-green-600 hover:underline mt-2 inline-block">
                        Create your first plot
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">Category</th>
                                <th className="px-4 py-3 text-right">Area (m²)</th>
                                <th className="px-4 py-3 text-right">Hectares</th>
                                <th className="px-4 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {plots.map(plot => (
                                <tr key={plot.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-800">{plot.name}</td>
                                    <td className="px-4 py-3 text-gray-600">{plot.category?.name ?? '—'}</td>
                                    <td className="px-4 py-3 text-right text-gray-700">
                                        {Number(plot.area_sqm).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-4 py-3 text-right text-gray-700">
                                        {Number(plot.hectares).toLocaleString(undefined, { maximumFractionDigits: 4 })}
                                    </td>
                                    <td className="px-4 py-3 text-center space-x-2">
                                        <Link to={`/plots/${plot.id}`} className="text-blue-600 hover:underline">View</Link>
                                        <Link to={`/plots/${plot.id}/edit`} className="text-green-600 hover:underline">Edit</Link>
                                        <button
                                            onClick={() => handleDelete(plot)}
                                            disabled={deleting === plot.id}
                                            className="text-red-600 hover:underline disabled:opacity-50"
                                        >
                                            {deleting === plot.id ? 'Deleting…' : 'Delete'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
