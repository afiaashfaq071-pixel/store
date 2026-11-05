import { useParams } from 'react-router-dom';
import useProducts from '../hooks/useProducts.js';
import CategoryPage from '../components/categories/CategoryPage.jsx';
import NotFound from './NotFound.jsx';

export default function Category() {
  const { slug } = useParams();
  const { categories, categoriesLoading } = useProducts();
  const category = categories.find((c) => c.slug === slug);
  if (!category && categoriesLoading) return <p className="container-page py-20 text-center text-ink/60" role="status">Loading category…</p>;
  if (!category) return <NotFound />;
  return <CategoryPage category={category} />;
}
