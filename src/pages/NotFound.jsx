import { Compass } from 'lucide-react';
import StateIllustration from '../components/common/StateIllustration.jsx';
import Button from '../components/common/Button.jsx';

/** Branded 404 page. */
export default function NotFound({ message = "We couldn't find the page you're looking for." }) {
  return (
    <div className="container-page flex flex-col items-center py-16 text-center">
      <StateIllustration icon={Compass} />
      <h1 className="mt-6 text-6xl font-extrabold text-brand">404</h1>
      <h2 className="mt-2 text-2xl font-extrabold">Page not found</h2>
      <p className="mt-2 max-w-md text-ink/60">{message}</p>
      <div className="mt-6 flex gap-3">
        <Button to="/">Back to Home</Button>
        <Button to="/shop" variant="outline">Browse Shop</Button>
      </div>
    </div>
  );
}
