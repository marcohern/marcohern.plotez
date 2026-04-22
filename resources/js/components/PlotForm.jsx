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
        <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                    {errors.general}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.name ? 'border-red-400' : 'border-gray-300'}`}
                    />
                    {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select
                        value={categoryId}
                        onChange={e => setCategoryId(e.target.value)}
                        className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.category_id ? 'border-red-400' : 'border-gray-300'}`}
                    >
                        <option value="">— Select category —</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    {errors.category_id && <p className="text-red-600 text-xs mt-1">{errors.category_id}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Area (m²)</label>
                    <input
                        type="text"
                        readOnly
                        value={mapData.area_sqm ? Number(mapData.area_sqm).toLocaleString(undefined, { maximumFractionDigits: 2 }) : '—'}
                        className="w-full border border-gray-200 bg-gray-50 rounded px-3 py-2 text-sm text-gray-600 cursor-not-allowed"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hectares</label>
                    <input
                        type="text"
                        readOnly
                        value={mapData.hectares ? Number(mapData.hectares).toLocaleString(undefined, { maximumFractionDigits: 6 }) : '—'}
                        className="w-full border border-gray-200 bg-gray-50 rounded px-3 py-2 text-sm text-gray-600 cursor-not-allowed"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Plot Shape *</label>
                <p className="text-xs text-gray-500 mb-2">
                    Use the polygon tool on the map to draw the plot boundary. The shape must be closed and have at least 3 points.
                    You can edit the shape by dragging its vertices.
                </p>
                <PlotMap
                    initialCoordinates={mapData.coordinates}
                    onChange={setMapData}
                />
                {errors.coordinates && <p className="text-red-600 text-xs mt-1">{errors.coordinates}</p>}
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50"
                >
                    {submitting ? 'Saving…' : submitLabel}
                </button>
            </div>
        </form>
    );
}
