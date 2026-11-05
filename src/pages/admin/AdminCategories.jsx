import { useState } from 'react';
import { isSupabaseEnabled } from '../../lib/supabase.js';
import { Pencil, Plus, RotateCcw, Trash2 } from 'lucide-react';
import useProducts from '../../hooks/useProducts.js';
import { useToast } from '../../context/ToastContext.jsx';
import Modal from '../../components/common/Modal.jsx';
import Button from '../../components/common/Button.jsx';

const slugify = (s) => s.toLowerCase().trim().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default function AdminCategories() {
  const { categories, categoriesLoading, products, addCategory, updateCategory, deleteCategory, resetCatalog } = useProducts();
  const { showToast } = useToast();
  const [editing, setEditing] = useState(null); // null | 'new' | category
  const [form, setForm] = useState({ name: '', emoji: '📦', blurb: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const open = (c) => {
    setError('');
    setForm(c === 'new' ? { name: '', emoji: '📦', blurb: '' } : { name: c.name, emoji: c.emoji, blurb: c.blurb || '' });
    setEditing(c);
  };

  const save = async (e) => {
    e.preventDefault();
    if (busy) return;
    const name = form.name.trim();
    if (name.length < 2) return setError('Category name is required (at least 2 letters).');
    const sameName = (c) => c.name.trim().toLowerCase() === name.toLowerCase() && c !== editing;
    if (categories.some(sameName)) return setError('A category with this name already exists.');
    setBusy(true);
    try {
      if (editing === 'new') {
        const slug = slugify(name);
        if (!slug || categories.some((c) => c.slug === slug)) throw new Error('A category with this name already exists.');
        await addCategory({ slug, name, short: name.split(/[ &]/)[0], emoji: form.emoji || '📦', blurb: form.blurb });
        showToast('Category added');
      } else {
        await updateCategory(editing.slug, { name, emoji: form.emoji || '📦', blurb: form.blurb });
        showToast('Category updated');
      }
      setEditing(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (c) => {
    const n = products.filter((p) => p.category === c.slug).length;
    if (n > 0) return showToast(`Move or delete the ${n} product(s) in "${c.short || c.name}" first`, 'error');
    if (!window.confirm(`Delete the category "${c.name}"?`)) return;
    try {
      await deleteCategory(c.slug);
      showToast('Category deleted', 'info');
    } catch (err) {
      showToast(`Could not delete the category: ${err.message}`, 'error');
    }
  };

  const reset = () => {
    if (window.confirm('Reset the sample products, categories and coupons to the original demo data?')) {
      resetCatalog();
      showToast('Catalogue reset to demo data', 'info');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap justify-between gap-3">
        {isSupabaseEnabled ? <span /> : <Button variant="outline" icon={RotateCcw} onClick={reset}>Reset demo data</Button>}
        <Button icon={Plus} onClick={() => open('new')}>Add category</Button>
      </div>
      {categoriesLoading && <p className="text-sm text-ink/60" role="status">Loading categories…</p>}
      {!categoriesLoading && categories.length === 0 && <p className="rounded-2xl bg-surface p-8 text-center text-sm text-ink/50 shadow-soft">No categories yet. Add your first one.</p>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((c) => (
          <div key={c.slug} className={`flex items-center gap-4 rounded-2xl bg-gradient-to-br p-5 shadow-soft ${c.tint}`}>
            <span className="text-4xl">{c.emoji}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-extrabold">{c.name}</p>
              <p className="text-xs text-ink/60">{products.filter((p) => p.category === c.slug).length} products · /{c.slug}</p>
            </div>
            <button onClick={() => open(c)} className="rounded-full bg-surface/70 p-2 hover:bg-surface" aria-label={`Edit ${c.name}`}><Pencil className="h-4 w-4" /></button>
            <button onClick={() => remove(c)} className="rounded-full bg-surface/70 p-2 text-red-500 hover:bg-surface" aria-label={`Delete ${c.name}`}><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing === 'new' ? 'Add category' : 'Edit category'} size="max-w-lg">
        <form onSubmit={save} className="space-y-4" noValidate>
          <div><label htmlFor="cat-name" className="mb-1 block text-sm font-semibold">Name</label><input id="cat-name" className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><label htmlFor="cat-emoji" className="mb-1 block text-sm font-semibold">Emoji</label><input id="cat-emoji" maxLength={4} className="input-field" value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} /></div>
          <div><label htmlFor="cat-blurb" className="mb-1 block text-sm font-semibold">Description</label><textarea id="cat-blurb" rows={2} className="input-field" value={form.blurb} onChange={(e) => setForm({ ...form, blurb: e.target.value })} /></div>
          {error && <p className="text-sm text-red-500" role="alert">{error}</p>}
          <div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button><Button type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save'}</Button></div>
        </form>
      </Modal>
    </div>
  );
}
