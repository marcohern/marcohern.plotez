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

    if (loading) return <p className="text-muted">Loading plots...</p>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h3 mb-0">Plots of Terrain</h1>
                <Link to="/plots/create" className="btn btn-success btn-sm">+ New Plot</Link>
            </div>

            {plots.length === 0 ? (
                <div className="text-center py-5 text-muted">
                    <p className="fs-5">No plots yet.</p>
                    <Link to="/plots/create" className="text-success">Create your first plot</Link>
                </div>
            ) : (
                <div className="card shadow-sm">
                    <div className="table-responsive">
                        <table className="table table-hover table-bordered align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th className="text-end">Area (m²)</th>
                                    <th className="text-end">Hectares</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {plots.map(plot => (
                                    <tr key={plot.id}>
                                        <td className="fw-medium">{plot.name}</td>
                                        <td className="text-muted">{plot.category?.name ?? '—'}</td>
                                        <td className="text-end">
                                            {Number(plot.area_sqm).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                        </td>
                                        <td className="text-end">
                                            {Number(plot.hectares).toLocaleString(undefined, { maximumFractionDigits: 4 })}
                                        </td>
                                        <td className="text-center">
                                            <Link to={`/plots/${plot.id}`} className="btn btn-link btn-sm text-primary p-0 me-2">View</Link>
                                            <Link to={`/plots/${plot.id}/edit`} className="btn btn-link btn-sm text-success p-0 me-2">Edit</Link>
                                            <button
                                                onClick={() => handleDelete(plot)}
                                                disabled={deleting === plot.id}
                                                className="btn btn-link btn-sm text-danger p-0"
                                            >
                                                {deleting === plot.id ? 'Deleting…' : 'Delete'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
