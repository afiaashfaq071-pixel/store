import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext.jsx';
import { ProductProvider } from './context/ProductContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';
import { OrderProvider } from './context/OrderContext.jsx';
import { SettingsProvider } from './context/SettingsContext.jsx';

import PageLayout from './components/layout/PageLayout.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';
import AdminGate from './components/admin/AdminGate.jsx';

import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import Categories from './pages/Categories.jsx';
import Category from './pages/Category.jsx';
import ProductPage from './pages/ProductPage.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import WishlistPage from './pages/WishlistPage.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';

import Dashboard from './pages/admin/Dashboard.jsx';
import AdminProducts from './pages/admin/AdminProducts.jsx';
import AdminCategories from './pages/admin/AdminCategories.jsx';
import AdminStock from './pages/admin/AdminStock.jsx';
import AdminOrders from './pages/admin/AdminOrders.jsx';
import AdminSales from './pages/admin/AdminSales.jsx';
import AdminCustomers from './pages/admin/AdminCustomers.jsx';
import AdminDiscounts from './pages/admin/AdminDiscounts.jsx';
import AdminSettings from './pages/admin/AdminSettings.jsx';
import AdminFollowUps from './pages/admin/AdminFollowUps.jsx';

/** App-level providers and routing only. */
export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ProductProvider>
          <SettingsProvider>
          <OrderProvider>
            <CartProvider>
              <WishlistProvider>
                <Routes>
                  <Route element={<PageLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/category/:slug" element={<Category />} />
                    <Route path="/product/:id" element={<ProductPage />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>

                  <Route path="/admin" element={<AdminGate><AdminLayout /></AdminGate>}>
                    <Route index element={<Dashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="stock" element={<AdminStock />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="sales" element={<AdminSales />} />
                    <Route path="customers" element={<AdminCustomers />} />
                    <Route path="discounts" element={<AdminDiscounts />} />
                    <Route path="follow-ups" element={<AdminFollowUps />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>
                </Routes>
              </WishlistProvider>
            </CartProvider>
          </OrderProvider>
          </SettingsProvider>
        </ProductProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
