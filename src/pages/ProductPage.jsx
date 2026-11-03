import { Link, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import useProducts from '../hooks/useProducts.js';
import ProductDetails from '../components/products/ProductDetails.jsx';
import RelatedProducts from '../components/products/RelatedProducts.jsx';
import NotFound from './NotFound.jsx';

export default function ProductPage() {
  const { id } = useParams();
  const { getProduct, categories } = useProducts();
  const product = getProduct(id);
  if (!product) return <NotFound message="We couldn't find that product — it may have been removed." />;
  const category = categories.find((c) => c.slug === product.category);

  return (
    <div className="container-page py-8">
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-xs text-ink/50" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-brand">Home</Link><ChevronRight className="h-3 w-3" />
        <Link to="/shop" className="hover:text-brand">Shop</Link><ChevronRight className="h-3 w-3" />
        {category && <><Link to={`/category/${category.slug}`} className="hover:text-brand">{category.short || category.name}</Link><ChevronRight className="h-3 w-3" /></>}
        <span className="font-semibold text-ink">{product.name}</span>
      </nav>
      <ProductDetails key={product.id} product={product} />
      <RelatedProducts product={product} />
    </div>
  );
}
