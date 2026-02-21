import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'
import { WishlistProvider } from '@/context/WishlistContext'
import Layout from '@/components/layout/Layout'

// Pages
import Home from '@/pages/Home'
import RetailPage from '@/pages/retail/RetailPage'
import WholesalePage from '@/pages/retail/WholesalePage'
import CategoryPage from '@/pages/retail/CategoryPage'
import ProductDetailPage from '@/pages/retail/ProductDetailPage'
import RequestQuotePage from '@/pages/quote/RequestQuotePage'
import ServicesPreOwnedPage from '@/pages/services/ServicesPreOwnedPage'
import ExportImportPage from '@/pages/export-import/ExportImportPage'
import CartPage from '@/pages/CartPage'
import CheckoutPage from '@/pages/CheckoutPage'
import WishlistPage from '@/pages/WishlistPage'
import ProfilePage from '@/pages/ProfilePage'
import OrderTrackingPage from '@/pages/OrderTrackingPage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import ContactPage from '@/pages/ContactPage'
import SearchPage from '@/pages/SearchPage'

// Admin
import AdminLayout from '@/pages/admin/AdminLayout'
import AdminLoginPage from '@/pages/admin/AdminLoginPage'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import AdminProductsPage from '@/pages/admin/AdminProductsPage'
import AdminOrdersPage from '@/pages/admin/AdminOrdersPage'
import AdminCustomersPage from '@/pages/admin/AdminCustomersPage'
import AdminQuotesPage from '@/pages/admin/AdminQuotesPage'

// Simple placeholder component for WIP pages
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="text-3xl font-black text-gray-700 mb-2">{title}</h1>
      <p className="text-gray-400">This page is coming soon.</p>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
        <Routes>
          {/* Auth pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="customers" element={<AdminCustomersPage />} />
            <Route path="quotes" element={<AdminQuotesPage />} />
          </Route>

          {/* Main layout */}
          <Route element={<Layout />}>
            <Route index element={<Home />} />

            {/* Module 1: Retail & Wholesale */}
            <Route path="retail" element={<RetailPage />} />
            <Route path="wholesale" element={<WholesalePage />} />
            <Route path="category/:slug" element={<CategoryPage />} />
            <Route path="product/:slug" element={<ProductDetailPage />} />
            <Route path="search" element={<SearchPage />} />

            {/* Module 2: Request for Quote */}
            <Route path="request-quote" element={<RequestQuotePage />} />

            {/* Module 3: Services & Pre-Owned */}
            <Route path="services" element={<ServicesPreOwnedPage />} />

            {/* Module 4: Export & Import */}
            <Route path="export-import" element={<ExportImportPage />} />

            {/* Cart & Checkout */}
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="profile" element={<ProfilePage />} />

            {/* Info pages */}
            <Route path="contact" element={<ContactPage />} />
            <Route path="about" element={<PlaceholderPage title="About Us" />} />
            <Route path="track-order" element={<OrderTrackingPage />} />
            <Route path="faq" element={<PlaceholderPage title="FAQs" />} />
            <Route path="returns" element={<PlaceholderPage title="Returns & Exchange" />} />
            <Route path="shipping-policy" element={<PlaceholderPage title="Shipping Policy" />} />
            <Route path="refund-policy" element={<PlaceholderPage title="Refund Policy" />} />
            <Route path="privacy-policy" element={<PlaceholderPage title="Privacy Policy" />} />
            <Route path="terms" element={<PlaceholderPage title="Terms & Conditions" />} />
            <Route path="disclaimer" element={<PlaceholderPage title="Disclaimer" />} />
            <Route path="copyright" element={<PlaceholderPage title="Trademark & Copyright" />} />
            <Route path="sitemap" element={<PlaceholderPage title="Sitemap" />} />

            {/* 404 */}
            <Route path="*" element={<PlaceholderPage title="404 – Page Not Found" />} />
          </Route>
        </Routes>
      </CartProvider>
    </WishlistProvider>
    </AuthProvider>
  )
}
