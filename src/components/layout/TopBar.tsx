import { Link } from 'react-router-dom'
import { Phone, MessageCircle, Facebook, Twitter, Instagram, MapPin } from 'lucide-react'

export default function TopBar() {
  return (
    <div className="bg-topbar text-gray-200 text-xs py-2">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-2 px-4">
        {/* Left */}
        <span className="font-medium tracking-wide">
          FREE DELIVERY. STANDARD SHIPPING ORDERS 10000+
        </span>

        {/* Center */}
        <div className="flex items-center gap-4">
          <a href="tel:8073667950" className="flex items-center gap-1 hover:text-secondary transition-colors">
            <Phone size={12} /> 8073667950
          </a>
          <a href="https://wa.me/918073667950" target="_blank" rel="noreferrer"
            className="flex items-center gap-1 hover:text-secondary transition-colors">
            <MessageCircle size={12} /> WHATSAPP SUPPORT
          </a>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <a href="/contact" className="flex items-center gap-1 hover:text-secondary transition-colors">
            <MapPin size={12} /> Locate Me
          </a>
          <Link to="/login" className="hover:text-secondary transition-colors">Log In</Link>
          <Link to="/register" className="hover:text-secondary transition-colors">Register</Link>
          <div className="flex items-center gap-2 ml-2">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-secondary">
              <Facebook size={13} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-secondary">
              <Twitter size={13} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-secondary">
              <Instagram size={13} />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
