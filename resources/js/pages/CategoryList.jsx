import React, { useEffect, useState } from "react";
import { categories as categoriesApi } from "../api";

function CategoryModal({ initial, onSave, onClose }) {
    const [name, setName] = useState(initial?.name ?? "");
    const [description, setDescription] = useState(initial?.description ?? "");
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    async function handleSubmit(ev) {
        ev.preventDefault();
        const e = {};
        if (!name.trim()) e.name = "Name is required.";
        if (Object.keys(e).length) { setErrors(e); return; }
        setErrors({});
        setSaving(true);
        try {
            await onSave({ name: name.trim(), description: description.trim() });
        } catch (err) {
            const data = err?.response?.data;
            if (data?.errors) setErrors(data.errors);
            else setErrors({ general: data?.message ?? "An error occurred." });
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                    {initial ? "Edit Category" : "New Category"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {errors.general && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                            {errors.general}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            autoFocus
                            className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.name ? "border-red-400" : "border-gray-300"}`}
                        />
                        {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
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
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 text-sm font-medium disabled:opacity-50"
                        >
                            {saving ? "Saving…" : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function CategoryList() {
    const [cats, setCats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        categoriesApi.list()
            .then(setCats)
            .finally(() => setLoading(false));
    }, []);

    async function handleSave(data) {
        if (modal === "create") {
            const cat = await categoriesApi.create(data);
            setCats(prev => [...prev, cat].sort((a, b) => a.name.localeCompare(b.name)));
        } else {
            const cat = await categoriesApi.update(modal.id, data);
            setCats(prev => prev.map(c => c.id === cat.id ? cat : c));
        }
        setModal(null);
    }

    async function handleDelete(cat) {
        if (!confirm(`Delete category "${cat.name}"?`)) return;
        setDeleting(cat.id);
        try {
            await categoriesApi.delete(cat.id);
            setCats(prev => prev.filter(c => c.id !== cat.id));
        } catch (err) {
            const msg = err?.response?.data?.message ?? "Cannot delete category.";
            alert(msg);
        } finally {
            setDeleting(null);
        }
    }

    if (loading) return <p className="text-gray-500">Loading…</p>;

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
                <button
                    onClick={() => setModal("create")}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm font-medium transition-colors"
                >
                    + New Category
                </button>
            </div>

            {cats.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <p>No categories yet.</p>
                    <button onClick={() => setModal("create")} className="text-green-600 hover:underline mt-2">
                        Create your first category
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">Description</th>
                                <th className="px-4 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {cats.map(cat => (
                                <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-800">{cat.name}</td>
                                    <td className="px-4 py-3 text-gray-500">{cat.description || "—"}</td>
                                    <td className="px-4 py-3 text-center space-x-3">
                                        <button onClick={() => setModal(cat)} className="text-green-600 hover:underline">Edit</button>
                                        <button
                                            onClick={() => handleDelete(cat)}
                                            disabled={deleting === cat.id}
                                            className="text-red-600 hover:underline disabled:opacity-50"
                                        >
                                            {deleting === cat.id ? "Deleting…" : "Delete"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {modal !== null && (
                <CategoryModal
                    initial={modal === "create" ? null : modal}
                    onSave={handleSave}
                    onClose={() => setModal(null)}
                />
            )}
        </div>
    );
}
