import { Outlet } from 'react-router-dom';
import AnnouncementBar from './AnnouncementBar.jsx';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import MobileNavigation from './MobileNavigation.jsx';
import CartDrawer from '../cart/CartDrawer.jsx';
import ScrollToTop from '../common/ScrollToTop.jsx';

/** Shared storefront shell: announcement bar, sticky navbar, page content, footer, drawer. */
export default function PageLayout() {
  return (
    <div className="flex min-h-screen flex-col pb-16 lg:pb-0">
      <ScrollToTop />
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-white">
        Skip to content
      </a>
      <AnnouncementBar />
      <Navbar />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <MobileNavigation />
      <CartDrawer />
    </div>
  );
}
