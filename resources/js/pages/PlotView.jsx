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

    if (loading) return <p className="text-muted">Loading…</p>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center gap-3">
                    <Link to="/plots" className="btn btn-link text-success p-0 btn-sm">← Plots</Link>
                    <h1 className="h3 mb-0">{plot.name}</h1>
                </div>
                <div>
                    <Link to={`/plots/${id}/edit`} className="btn btn-outline-success btn-sm me-2">Edit</Link>
                    <button onClick={handleDelete} className="btn btn-outline-danger btn-sm">Delete</button>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-lg-8">
                    <div className="card shadow-sm">
                        <div className="card-body p-3">
                            <PlotMap initialCoordinates={plot.coordinates} readOnly />
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <dl className="mb-0">
                                <dt className="text-muted small text-uppercase mb-1">Category</dt>
                                <dd className="mb-3">{plot.category?.name ?? '—'}</dd>

                                <dt className="text-muted small text-uppercase mb-1">Description</dt>
                                <dd className="mb-3" style={{ whiteSpace: 'pre-wrap' }}>{plot.description || '—'}</dd>

                                <hr />

                                <dt className="text-muted small text-uppercase mb-1">Area</dt>
                                <dd className="mb-3">
                                    <span className="fs-4 fw-bold text-success">
                                        {Number(plot.area_sqm).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                    </span>
                                    <span className="text-muted ms-1">m²</span>
                                </dd>

                                <dt className="text-muted small text-uppercase mb-1">Hectares</dt>
                                <dd className="mb-3">
                                    <span className="fs-4 fw-bold text-success">
                                        {Number(plot.hectares).toLocaleString(undefined, { maximumFractionDigits: 6 })}
                                    </span>
                                    <span className="text-muted ms-1">ha</span>
                                </dd>

                                <dt className="text-muted small text-uppercase mb-1">Vertices</dt>
                                <dd className="mb-0">{plot.coordinates?.length ?? 0} points</dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
