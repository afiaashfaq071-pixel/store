import { useRef, useState } from 'react';
import { ImagePlus, Trash2 } from 'lucide-react';
import Button from '../common/Button.jsx';
import { fileToResizedDataUrl } from '../../utils/image.js';

const blank = { name: '', category: '', price: '', stock: '', description: '', image: '' };

/**
 * Add / edit product form: item name, price, stock (quantity present), description and a photo
 * picked from the phone gallery. Calls onSave with cleaned numeric values.
 */
export default function ProductForm({ initial, categories, onSave, onCancel }) {
  const [form, setForm] = useState(() => ({ ...blank, category: categories[0]?.slug || '', ...initial, image: initial?.image || '' }));
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const pickPhoto = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = ''; // allows picking the same photo again later
    if (!file) return;
    setError('');
    setBusy(true);
    try {
      const image = await fileToResizedDataUrl(file);
      setForm((f) => ({ ...f, image }));
    } catch (err) {
      setError(err.message || 'Could not use that photo.');
    } finally {
      setBusy(false);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    const price = Number(form.price);
    const name = form.name.trim();
    if (name.length < 2 || name.length > 120) return setError('The item name must be 2 to 120 characters.');
    if (!(price > 0) || price > 10000000) return setError('Enter a price above 0 (up to Rs. 10,000,000).');
    if (form.stock === '' || !(Number(form.stock) >= 0) || Number(form.stock) > 1000000) return setError('Enter how many are in stock (0 or more, whole number).');
    if (!form.category) return setError('Choose a category.');
    onSave({
      ...form,
      name: form.name.trim(),
      price,
      stock: Math.floor(Number(form.stock)),
      description: form.description.trim() || form.name.trim(),
      image: form.image || '',
    });
  };

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2" noValidate>
      <div className="sm:col-span-2">
        <label className="mb-1 block text-sm font-semibold" htmlFor="pf-name">Item name</label>
        <input id="pf-name" className="input-field" value={form.name} onChange={set('name')} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold" htmlFor="pf-price">Price (PKR)</label>
        <input id="pf-price" type="number" min="0" inputMode="numeric" className="input-field" value={form.price} onChange={set('price')} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold" htmlFor="pf-stock">Stock (present)</label>
        <input id="pf-stock" type="number" min="0" inputMode="numeric" className="input-field" value={form.stock} onChange={set('stock')} />
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1 block text-sm font-semibold" htmlFor="pf-cat">Category</label>
        <select id="pf-cat" className="input-field" value={form.category} onChange={set('category')}>
          {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1 block text-sm font-semibold" htmlFor="pf-desc">Description</label>
        <textarea id="pf-desc" rows={3} className="input-field" value={form.description} onChange={set('description')} />
      </div>

      <div className="sm:col-span-2">
        <span className="mb-1 block text-sm font-semibold">Photo</span>
        <div className="flex items-center gap-4 rounded-2xl border border-dashed border-ink/20 p-3">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-ink/5 text-3xl">
            {form.image ? <img src={form.image} alt="Selected product" className="h-full w-full object-cover" /> : '📦'}
          </div>
          <div className="flex flex-col items-start gap-2">
            <input ref={fileRef} type="file" accept="image/*" className="sr-only" id="pf-photo" onChange={pickPhoto} />
            <Button variant="outline" size="sm" icon={ImagePlus} disabled={busy} onClick={() => fileRef.current && fileRef.current.click()}>
              {busy ? 'Preparing photo…' : form.image ? 'Change photo' : 'Choose from gallery'}
            </Button>
            {form.image && <Button variant="ghost" size="sm" icon={Trash2} onClick={() => setForm((f) => ({ ...f, image: '' }))}>Remove photo</Button>}
            <p className="text-xs text-ink/50">Pick a picture from your phone's gallery (or take a new one).</p>
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-500 sm:col-span-2" role="alert">{error}</p>}
      <div className="flex justify-end gap-3 sm:col-span-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={busy}>Save product</Button>
      </div>
    </form>
  );
}
