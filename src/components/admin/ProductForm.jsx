import { useState } from 'react';
import Button from '../common/Button.jsx';

const blank = { name: '', brand: '', category: '', price: '', originalPrice: '', stock: '', emoji: '📦', unit: '1 piece', description: '' };

/** Add / edit product form. Calls onSave with cleaned numeric values. */
export default function ProductForm({ initial, categories, onSave, onCancel }) {
  const [form, setForm] = useState(() => ({ ...blank, category: categories[0]?.slug || '', ...initial, originalPrice: initial?.originalPrice ?? '' }));
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const price = Number(form.price);
    const original = form.originalPrice === '' ? null : Number(form.originalPrice);
    if (!form.name.trim() || !form.brand.trim()) return setError('Name and brand are required.');
    if (!(price > 0)) return setError('Enter a valid price.');
    if (original !== null && original <= price) return setError('Original price must be higher than the sale price (or leave it empty).');
    if (!(Number(form.stock) >= 0) || form.stock === '') return setError('Enter a valid stock quantity.');
    onSave({
      ...form,
      name: form.name.trim(),
      brand: form.brand.trim(),
      price,
      originalPrice: original,
      stock: Math.floor(Number(form.stock)),
      description: form.description.trim() || `${form.name.trim()} by ${form.brand.trim()}.`,
    });
  };

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2" noValidate>
      <div className="sm:col-span-2"><label className="mb-1 block text-sm font-semibold" htmlFor="pf-name">Product name</label><input id="pf-name" className="input-field" value={form.name} onChange={set('name')} /></div>
      <div><label className="mb-1 block text-sm font-semibold" htmlFor="pf-brand">Brand</label><input id="pf-brand" className="input-field" value={form.brand} onChange={set('brand')} /></div>
      <div>
        <label className="mb-1 block text-sm font-semibold" htmlFor="pf-cat">Category</label>
        <select id="pf-cat" className="input-field" value={form.category} onChange={set('category')}>{categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select>
      </div>
      <div><label className="mb-1 block text-sm font-semibold" htmlFor="pf-price">Price (PKR)</label><input id="pf-price" type="number" min="0" className="input-field" value={form.price} onChange={set('price')} /></div>
      <div><label className="mb-1 block text-sm font-semibold" htmlFor="pf-orig">Original price (optional)</label><input id="pf-orig" type="number" min="0" className="input-field" value={form.originalPrice} onChange={set('originalPrice')} /></div>
      <div><label className="mb-1 block text-sm font-semibold" htmlFor="pf-stock">Stock</label><input id="pf-stock" type="number" min="0" className="input-field" value={form.stock} onChange={set('stock')} /></div>
      <div><label className="mb-1 block text-sm font-semibold" htmlFor="pf-unit">Pack size</label><input id="pf-unit" className="input-field" value={form.unit} onChange={set('unit')} /></div>
      <div><label className="mb-1 block text-sm font-semibold" htmlFor="pf-emoji">Emoji icon</label><input id="pf-emoji" className="input-field" value={form.emoji} onChange={set('emoji')} maxLength={4} /></div>
      <div><label className="mb-1 block text-sm font-semibold" htmlFor="pf-img">Image URL (optional)</label><input id="pf-img" className="input-field" value={form.image || ''} onChange={set('image')} placeholder="https://…" /></div>
      <div className="sm:col-span-2"><label className="mb-1 block text-sm font-semibold" htmlFor="pf-desc">Description</label><textarea id="pf-desc" rows={3} className="input-field" value={form.description} onChange={set('description')} /></div>
      {error && <p className="text-sm text-red-500 sm:col-span-2" role="alert">{error}</p>}
      <div className="flex justify-end gap-3 sm:col-span-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save product</Button>
      </div>
    </form>
  );
}
