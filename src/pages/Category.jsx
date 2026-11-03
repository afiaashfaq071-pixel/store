import { useParams } from 'react-router-dom';
import useProducts from '../hooks/useProducts.js';
import CategoryPage from '../components/categories/CategoryPage.jsx';
import NotFound from './NotFound.jsx';

export default function Category() {
  const { slug } = useParams();
  const { categories } = useProducts();
  const category = categories.find((c) => c.slug === slug);
  if (!category) return <NotFound />;
  return <CategoryPage category={category} />;
}
