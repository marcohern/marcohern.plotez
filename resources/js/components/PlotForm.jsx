import React, { useEffect, useState } from 'react';
import { categories as categoriesApi } from '../api';
import PlotMap from './PlotMap';

export default function PlotForm({ initialData = {}, onSubmit, submitLabel = 'Save' }) {
    const [name, setName] = useState(initialData.name ?? '');
    const [description, setDescription] = useState(initialData.description ?? '');
    const [categoryId, setCategoryId] = useState(initialData.category_id ?? '');
    const [mapData, setMapData] = useState({
        coordinates: initialData.coordinates ?? null,
        area_sqm: initialData.area_sqm ?? 0,
        hectares: initialData.hectares ?? 0,
    });
    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        categoriesApi.list().then(setCategories).catch(() => {});
    }, []);

    function validate() {
        const e = {};
        if (!name.trim()) e.name = 'Name is required.';
        if (!categoryId) e.category_id = 'Category is required.';
        if (!mapData.coordinates || mapData.coordinates.length < 3) {
            e.coordinates = 'A closed polygon with at least 3 points is required.';
        }
        return e;
    }

    async function handleSubmit(ev) {
        ev.preventDefault();
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }
        setErrors({});
        setSubmitting(true);
        try {
            await onSubmit({
                name: name.trim(),
                description: description.trim(),
                category_id: Number(categoryId),
                coordinates: mapData.coordinates,
                area_sqm: mapData.area_sqm,
                hectares: mapData.hectares,
            });
        } catch (err) {
            const data = err?.response?.data;
            if (data?.errors) {
                setErrors(data.errors);
            } else {
                setErrors({ general: data?.message ?? 'An error occurred.' });
            }
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            {errors.general && (
                <div className="alert alert-danger py-2 mb-3">{errors.general}</div>
            )}

            <div className="row g-3 mb-3">
                <div className="col-md-6">
                    <label className="form-label fw-medium">Name <span className="text-danger">*</span></label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                <div className="col-md-6">
                    <label className="form-label fw-medium">Category <span className="text-danger">*</span></label>
                    <select
                        value={categoryId}
                        onChange={e => setCategoryId(e.target.value)}
                        className={`form-select ${errors.category_id ? 'is-invalid' : ''}`}
                    >
                        <option value="">— Select category —</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    {errors.category_id && <div className="invalid-feedback">{errors.category_id}</div>}
                </div>
            </div>

            <div className="mb-3">
                <label className="form-label fw-medium">Description</label>
                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={3}
                    className="form-control"
                />
            </div>

            <div className="row g-3 mb-3">
                <div className="col-md-6">
                    <label className="form-label fw-medium">Area (m²)</label>
                    <input
                        type="text"
                        readOnly
                        value={mapData.area_sqm ? Number(mapData.area_sqm).toLocaleString(undefined, { maximumFractionDigits: 2 }) : '—'}
                        className="form-control-plaintext border rounded px-3 py-2 bg-light text-muted"
                    />
                </div>
                <div className="col-md-6">
                    <label className="form-label fw-medium">Hectares</label>
                    <input
                        type="text"
                        readOnly
                        value={mapData.hectares ? Number(mapData.hectares).toLocaleString(undefined, { maximumFractionDigits: 6 }) : '—'}
                        className="form-control-plaintext border rounded px-3 py-2 bg-light text-muted"
                    />
                </div>
            </div>

            <div className="mb-4">
                <label className="form-label fw-medium">Plot Shape <span className="text-danger">*</span></label>
                <p className="text-muted small mb-2">
                    Use the polygon tool on the map to draw the plot boundary. The shape must be closed and have at least 3 points.
                    You can edit the shape by dragging its vertices.
                </p>
                <PlotMap
                    initialCoordinates={mapData.coordinates}
                    onChange={setMapData}
                />
                {errors.coordinates && <div className="text-danger small mt-1">{errors.coordinates}</div>}
            </div>

            <div className="d-flex justify-content-end">
                <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-success px-4"
                >
                    {submitting ? 'Saving…' : submitLabel}
                </button>
            </div>
        </form>
    );
}
