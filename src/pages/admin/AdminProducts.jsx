import { useMemo, useState } from 'react';
import { Eraser, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import useProducts from '../../hooks/useProducts.js';
import { useToast } from '../../context/ToastContext.jsx';
import Modal from '../../components/common/Modal.jsx';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/common/Badge.jsx';
import ProductForm from '../../components/admin/ProductForm.jsx';
import ProductImage from '../../components/common/ProductImage.jsx';
import { formatPKR } from '../../utils/format.js';

export default function AdminProducts() {
  const { products, categories, addProduct, updateProduct, deleteProduct, removeSampleProducts } = useProducts();
  const { showToast } = useToast();
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(null); // null | 'new' | product
  const [toDelete, setToDelete] = useState(null);
  const [clearSamples, setClearSamples] = useState(false);
  const [catFilter, setCatFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const totalUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const outCount = products.filter((p) => p.stock === 0).length;
  const sampleCount = products.filter((p) => p.sample).length;

  const catName = (slug) => categories.find((c) => c.slug === slug)?.short || slug;

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (catFilter !== 'all' && p.category !== catFilter) return false;
      if (stockFilter === 'in' && !(p.stock > 10)) return false;
      if (stockFilter === 'low' && !(p.stock > 0 && p.stock <= 10)) return false;
      if (stockFilter === 'out' && p.stock !== 0) return false;
      if (!q) return true;
      return p.name.toLowerCase().includes(q) || (p.brand || '').toLowerCase().includes(q) || catName(p.category).toLowerCase().includes(q);
    });
  }, [products, categories, query, catFilter, stockFilter]);

  const save = async (data) => {
    try {
      if (editing === 'new') {
        await addProduct(data);
        showToast('Product added');
      } else {
        updateProduct(editing.id, data);
        showToast('Product updated');
      }
      setEditing(null);
    } catch (err) {
      showToast(`Could not save the product: ${err.message}`, 'error');
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteProduct(toDelete.id);
      showToast(`Deleted ${toDelete.name}`, 'info');
    } catch (err) {
      showToast(`Could not delete: ${err.message}`, 'error');
    }
    setToDelete(null);
  };

  const confirmClearSamples = () => {
    removeSampleProducts();
    showToast('Sample products removed', 'info');
    setClearSamples(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products…" className="input-field pl-9" aria-label="Search products" />
        </div>
        <div className="flex flex-wrap gap-2">
          {sampleCount > 0 && <Button variant="outline" icon={Eraser} onClick={() => setClearSamples(true)}>Remove {sampleCount} sample products</Button>}
          <Button icon={Plus} onClick={() => setEditing('new')}>Add product</Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="sr-only" htmlFor="pf-filter-cat">Filter by category</label>
        <select id="pf-filter-cat" value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="rounded-full border border-ink/15 bg-surface px-4 py-2 text-sm font-semibold focus:border-brand focus:outline-none">
          <option value="all">All categories</option>
          {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
        <label className="sr-only" htmlFor="pf-filter-stock">Filter by stock</label>
        <select id="pf-filter-stock" value={stockFilter} onChange={(e) => setStockFilter(e.target.value)} className="rounded-full border border-ink/15 bg-surface px-4 py-2 text-sm font-semibold focus:border-brand focus:outline-none">
          <option value="all">Any stock level</option>
          <option value="in">In stock (11+)</option>
          <option value="low">Low stock (1–10)</option>
          <option value="out">Out of stock</option>
        </select>
        {(query || catFilter !== 'all' || stockFilter !== 'all') && (
          <button onClick={() => { setQuery(''); setCatFilter('all'); setStockFilter('all'); }} className="text-sm font-semibold text-brand hover:underline">Clear filters</button>
        )}
        <p className="ml-auto text-sm text-ink/60" aria-live="polite">
          <b className="text-ink">{products.length}</b> product{products.length === 1 ? '' : 's'} · <b className="text-ink">{totalUnits.toLocaleString('en-PK')}</b> units in stock · <b className="text-ink">{outCount}</b> out of stock
        </p>
      </div>

      <div className="overflow-x-auto rounded-3xl bg-surface p-2 shadow-soft">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wider text-ink/40"><tr><th className="p-3">Product</th><th>Category</th><th>Price</th><th>Stock</th><th className="text-right pr-3">Actions</th></tr></thead>
          <tbody className="divide-y divide-ink/5">
            {list.map((p) => (
              <tr key={p.id}>
                <td className="p-3">
                  <span className="mr-2 inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-ink/5 align-middle"><ProductImage product={p} size="sm" /></span>
                  <span className="font-semibold">{p.name}</span>
                  {p.sample && <span className="ml-2"><Badge tone="gold">Sample</Badge></span>}
                </td>
                <td>{catName(p.category)}</td>
                <td>{formatPKR(p.price)}{p.originalPrice && <span className="ml-1 text-xs text-ink/40 line-through">{formatPKR(p.originalPrice)}</span>}</td>
                <td><Badge tone={p.stock === 0 ? 'danger' : p.stock <= 10 ? 'gold' : 'success'}>{p.stock}</Badge></td>
                <td className="pr-3 text-right">
                  <button onClick={() => setEditing(p)} className="rounded-full p-2 hover:bg-ink/5" aria-label={`Edit ${p.name}`}><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => setToDelete(p)} className="rounded-full p-2 text-red-500 hover:bg-red-500/10" aria-label={`Delete ${p.name}`}><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <p className="p-8 text-center text-sm text-ink/50">{products.length === 0 ? 'No products yet — add your first product.' : 'No products match your search or filters.'}</p>}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing === 'new' ? 'Add product' : 'Edit product'} size="max-w-2xl">
        {editing && <ProductForm initial={editing === 'new' ? null : editing} categories={categories} onSave={save} onCancel={() => setEditing(null)} />}
      </Modal>

      <Modal open={clearSamples} onClose={() => setClearSamples(false)} title="Remove sample products?" size="max-w-md">
        <p className="text-sm text-ink/70">All {sampleCount} sample products will be removed. The items you added yourself stay.</p>
        <div className="mt-5 flex justify-end gap-3"><Button variant="outline" onClick={() => setClearSamples(false)}>Cancel</Button><Button variant="danger" onClick={confirmClearSamples}>Remove samples</Button></div>
      </Modal>

      <Modal open={!!toDelete} onClose={() => setToDelete(null)} title="Delete product?" size="max-w-md">
        <p className="text-sm text-ink/70">“{toDelete?.name}” will be removed from the store. This cannot be undone.</p>
        <div className="mt-5 flex justify-end gap-3"><Button variant="outline" onClick={() => setToDelete(null)}>Cancel</Button><Button variant="danger" onClick={confirmDelete}>Delete</Button></div>
      </Modal>
    </div>
  );
}
