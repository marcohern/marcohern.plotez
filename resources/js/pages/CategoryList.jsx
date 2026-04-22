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
        <div
            className="modal d-block"
            style={{ background: 'rgba(0,0,0,0.45)' }}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content shadow">
                    <div className="modal-header">
                        <h5 className="modal-title">{initial ? "Edit Category" : "New Category"}</h5>
                        <button type="button" className="btn-close" onClick={onClose} />
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            {errors.general && (
                                <div className="alert alert-danger py-2">{errors.general}</div>
                            )}
                            <div className="mb-3">
                                <label className="form-label fw-medium">Name <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    autoFocus
                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                />
                                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
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
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                            <button type="submit" disabled={saving} className="btn btn-success">
                                {saving ? "Saving…" : "Save"}
                            </button>
                        </div>
                    </form>
                </div>
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

    if (loading) return <p className="text-muted">Loading…</p>;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h3 mb-0">Categories</h1>
                <button onClick={() => setModal("create")} className="btn btn-success btn-sm">
                    + New Category
                </button>
            </div>

            {cats.length === 0 ? (
                <div className="text-center py-5 text-muted">
                    <p>No categories yet.</p>
                    <button onClick={() => setModal("create")} className="btn btn-link text-success p-0">
                        Create your first category
                    </button>
                </div>
            ) : (
                <div className="card shadow-sm">
                    <div className="table-responsive">
                        <table className="table table-hover table-bordered align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cats.map(cat => (
                                    <tr key={cat.id}>
                                        <td className="fw-medium">{cat.name}</td>
                                        <td className="text-muted">{cat.description || "—"}</td>
                                        <td className="text-center">
                                            <button onClick={() => setModal(cat)} className="btn btn-link btn-sm text-success p-0 me-2">Edit</button>
                                            <button
                                                onClick={() => handleDelete(cat)}
                                                disabled={deleting === cat.id}
                                                className="btn btn-link btn-sm text-danger p-0"
                                            >
                                                {deleting === cat.id ? "Deleting…" : "Delete"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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
