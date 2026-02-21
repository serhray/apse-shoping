import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ShoppingCart, Heart, User, ChevronDown, X, Menu, LogOut, LayoutDashboard } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useAuth } from '@/context/AuthContext'
import { CATEGORIES } from '@/data/mockData'

export default function Header() {
  const { count } = useCart()
  const { count: wishCount } = useWishlist()
  const { user, isLoggedIn, logout } = useAuth()
  const [query, setQuery] = useState('')
  const [showCategories, setShowCategories] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const dropRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setShowCategories(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center gap-4 py-3 px-4">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <div className="flex items-center gap-1">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xl leading-none">A</span>
            </div>
            <div className="leading-none">
              <div className="text-primary font-black text-lg tracking-tight">Apse</div>
              <div className="text-gray-500 text-xs font-medium">Shopping</div>
            </div>
          </div>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 flex items-center max-w-2xl mx-auto">
          <div className="relative flex-1">
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search products, brands, categories…"
              className="w-full border border-gray-200 rounded-full py-2.5 pl-5 pr-12 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')}
                className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
            <button type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary">
              <Search size={18} />
            </button>
          </div>
        </form>

        {/* Wishlist */}
        <Link to="/wishlist" className="relative flex items-center gap-2 text-gray-700 hover:text-primary flex-shrink-0">
          <div className="relative">
            <Heart size={24} />
            {wishCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {wishCount > 99 ? '99+' : wishCount}
              </span>
            )}
          </div>
          <div className="hidden sm:block text-sm leading-tight">
            <div className="text-xs text-gray-400">My</div>
            <div className="font-semibold">Wishlist</div>
          </div>
        </Link>

        {/* Cart */}
        <Link to="/cart" className="relative flex items-center gap-2 text-gray-700 hover:text-primary flex-shrink-0">
          <div className="relative">
            <ShoppingCart size={24} />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {count > 99 ? '99+' : count}
              </span>
            )}
          </div>
          <div className="hidden sm:block text-sm leading-tight">
            <div className="text-xs text-gray-400">My</div>
            <div className="font-semibold">Cart</div>
          </div>
        </Link>

        {/* Profile / Auth */}
        {isLoggedIn ? (
          <div className="relative hidden sm:block flex-shrink-0" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 text-gray-700 hover:text-primary"
            >
              <div className="w-8 h-8 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm flex-shrink-0">
                {user!.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block text-sm leading-tight text-left">
                <div className="text-xs text-gray-400">Hello,</div>
                <div className="font-semibold">{user!.name.split(' ')[0]}</div>
              </div>
              <ChevronDown size={14} className={`text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 w-52 z-50 py-2">
                <div className="px-4 py-2 border-b border-gray-100 mb-1">
                  <p className="text-sm font-semibold text-gray-800 truncate">{user!.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user!.email}</p>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                >
                  <User size={15} /> My Profile
                </Link>
                <Link
                  to="/profile"
                  state={{ tab: 'orders' }}
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                >
                  <LayoutDashboard size={15} /> My Orders
                </Link>
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button
                    onClick={() => { logout(); setShowUserMenu(false); navigate('/') }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="hidden sm:flex items-center gap-2 text-gray-700 hover:text-primary flex-shrink-0">
            <User size={24} />
            <div className="hidden sm:block text-sm leading-tight">
              <div className="text-xs text-gray-400">Sign</div>
              <div className="font-semibold">In</div>
            </div>
          </Link>
        )}

        {/* Mobile Menu Toggle */}
        <button className="lg:hidden text-gray-700" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Menu size={24} />
        </button>
      </div>

      {/* ─── Navbar ─────────────────────────────────────────────────────── */}
      <nav className="bg-navbarbottom text-white hidden lg:block">
        <div className="container mx-auto flex items-center px-4">
          {/* All Categories Dropdown */}
          <div className="relative" ref={dropRef}>
            <button
              onClick={() => setShowCategories(!showCategories)}
              className="flex items-center gap-2 bg-topbar px-4 py-3.5 font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              <Menu size={16} />
              ALL CATEGORIES
              <ChevronDown size={14} className={`transition-transform ${showCategories ? 'rotate-180' : ''}`} />
            </button>
            {showCategories && (
              <div className="absolute top-full left-0 bg-white text-gray-800 shadow-xl rounded-b-lg w-56 z-50 border border-gray-100">
                {CATEGORIES.map(cat => (
                  <Link key={cat.id} to={`/category/${cat.slug}`}
                    onClick={() => setShowCategories(false)}
                    className="block px-4 py-2.5 text-sm hover:bg-primary hover:text-white transition-colors border-b border-gray-50 last:border-0">
                    {cat.name}
                    {cat.productCount && (
                      <span className="float-right text-xs text-gray-400">{cat.productCount}</span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Nav Links */}
          <div className="flex items-center">
            {[
              { label: 'HOME', to: '/' },
              { label: 'RETAIL', to: '/retail' },
              { label: 'WHOLESALE', to: '/wholesale' },
              { label: 'REQUEST FOR QUOTE', to: '/request-quote' },
              { label: 'SERVICES & PRE OWNED', to: '/services' },
              { label: 'EXPORT & IMPORT', to: '/export-import' },
              { label: 'CONTACT US', to: '/contact' },
            ].map(link => (
              <Link key={link.to} to={link.to}
                className="px-4 py-3.5 text-sm font-medium hover:bg-white/20 transition-colors whitespace-nowrap">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Logo Repeat (right) */}
          <div className="ml-auto flex items-center gap-1 opacity-80">
            <span className="font-black text-base tracking-tight">|Apse</span>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-topbar text-white">
          {[
            { label: 'Home', to: '/' },
            { label: 'Retail', to: '/retail' },
            { label: 'Wholesale', to: '/wholesale' },
            { label: 'Request for Quote', to: '/request-quote' },
            { label: 'Services & Pre Owned', to: '/services' },
            { label: 'Export & Import', to: '/export-import' },
            { label: 'Contact Us', to: '/contact' },
          ].map(link => (
            <Link key={link.to} to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-6 py-3 border-b border-white/10 hover:bg-primary transition-colors text-sm font-medium">
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
