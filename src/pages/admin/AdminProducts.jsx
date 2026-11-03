import { useMemo, useState } from 'react';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import useProducts from '../../hooks/useProducts.js';
import { useToast } from '../../context/ToastContext.jsx';
import Modal from '../../components/common/Modal.jsx';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/common/Badge.jsx';
import ProductForm from '../../components/admin/ProductForm.jsx';
import { formatPKR } from '../../utils/format.js';

export default function AdminProducts() {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useProducts();
  const { showToast } = useToast();
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(null); // null | 'new' | product
  const [toDelete, setToDelete] = useState(null);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? products.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)) : products;
  }, [products, query]);

  const save = (data) => {
    if (editing === 'new') {
      addProduct(data);
      showToast('Product added');
    } else {
      updateProduct(editing.id, data);
      showToast('Product updated');
    }
    setEditing(null);
  };

  const confirmDelete = () => {
    deleteProduct(toDelete.id);
    showToast(`Deleted ${toDelete.name}`, 'info');
    setToDelete(null);
  };

  const catName = (slug) => categories.find((c) => c.slug === slug)?.short || slug;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products…" className="input-field pl-9" aria-label="Search products" />
        </div>
        <Button icon={Plus} onClick={() => setEditing('new')}>Add product</Button>
      </div>

      <div className="overflow-x-auto rounded-3xl bg-surface p-2 shadow-soft">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wider text-ink/40"><tr><th className="p-3">Product</th><th>Category</th><th>Price</th><th>Stock</th><th className="text-right pr-3">Actions</th></tr></thead>
          <tbody className="divide-y divide-ink/5">
            {list.map((p) => (
              <tr key={p.id}>
                <td className="p-3"><span className="mr-2 text-xl">{p.emoji}</span><span className="font-semibold">{p.name}</span><span className="block pl-8 text-xs text-ink/50">{p.brand}</span></td>
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
        {list.length === 0 && <p className="p-8 text-center text-sm text-ink/50">No products match your search.</p>}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing === 'new' ? 'Add product' : 'Edit product'} size="max-w-2xl">
        {editing && <ProductForm initial={editing === 'new' ? null : editing} categories={categories} onSave={save} onCancel={() => setEditing(null)} />}
      </Modal>

      <Modal open={!!toDelete} onClose={() => setToDelete(null)} title="Delete product?" size="max-w-md">
        <p className="text-sm text-ink/70">“{toDelete?.name}” will be removed from the store. This cannot be undone (except via Reset in Categories).</p>
        <div className="mt-5 flex justify-end gap-3"><Button variant="outline" onClick={() => setToDelete(null)}>Cancel</Button><Button variant="danger" onClick={confirmDelete}>Delete</Button></div>
      </Modal>
    </div>
  );
}
