import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, MessageCircle, Facebook, Twitter, Instagram, Youtube, Send } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function Footer() {
  const [email, setEmail] = useState('')

  function subscribe(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    toast.success('Subscribed successfully!')
    setEmail('')
  }

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5 pb-2 border-b border-gray-700">
              Contact Info
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <MapPin size={16} className="text-accent flex-shrink-0 mt-0.5" />
                <span>Shop No 4, Harsha Residency, Devangpeth Road Opp Samarth Apartment, Hubli 580023, Karnataka, India</span>
              </li>
              <li>
                <a href="tel:8073667950" className="flex items-center gap-3 hover:text-white transition-colors">
                  <Phone size={16} className="text-accent" />
                  8073667950
                </a>
              </li>
              <li>
                <a href="https://wa.me/918073667950" target="_blank" rel="noreferrer"
                  className="flex items-center gap-3 hover:text-white transition-colors">
                  <MessageCircle size={16} className="text-accent" />
                  WhatsApp Support
                </a>
              </li>
              <li>
                <a href="mailto:contact@apseshopping.com"
                  className="flex items-center gap-3 hover:text-white transition-colors">
                  <Mail size={16} className="text-accent" />
                  contact@apseshopping.com
                </a>
              </li>
            </ul>
            {/* Social */}
            <div className="flex gap-3 mt-5">
              {[
                { href: 'https://facebook.com', Icon: Facebook, label: 'Facebook' },
                { href: 'https://twitter.com', Icon: Twitter, label: 'Twitter' },
                { href: 'https://instagram.com', Icon: Instagram, label: 'Instagram' },
                { href: 'https://youtube.com', Icon: Youtube, label: 'YouTube' },
              ].map(({ href, Icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                  className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-primary transition-colors">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5 pb-2 border-b border-gray-700">
              Information
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Disclaimer', to: '/disclaimer' },
                { label: 'Shipping Policy', to: '/shipping-policy' },
                { label: 'Refund Policy', to: '/refund-policy' },
                { label: 'Privacy Policy', to: '/privacy-policy' },
                { label: 'Terms & Conditions', to: '/terms' },
                { label: 'Trademark & Copyright', to: '/copyright' },
                { label: 'Sitemap', to: '/sitemap' },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="flex items-center gap-2 hover:text-white hover:translate-x-1 transition-all">
                    <span className="w-1 h-1 rounded-full bg-accent inline-block" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5 pb-2 border-b border-gray-700">
              Customer Service
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'About Us', to: '/about' },
                { label: 'Contact Us', to: '/contact' },
                { label: 'Customer Login', to: '/login' },
                { label: 'Customer Register', to: '/register' },
                { label: 'Track Order', to: '/track-order' },
                { label: 'FAQs', to: '/faq' },
                { label: 'Returns & Exchange', to: '/returns' },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="flex items-center gap-2 hover:text-white hover:translate-x-1 transition-all">
                    <span className="w-1 h-1 rounded-full bg-accent inline-block" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5 pb-2 border-b border-gray-700">
              Newsletter
            </h4>
            <p className="text-sm mb-4">
              Get the latest information on events, sales and offers. Sign up for our newsletter.
            </p>
            <form onSubmit={subscribe} className="flex">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 px-3 py-2.5 text-sm bg-gray-800 border border-gray-700 rounded-l-md focus:outline-none focus:border-primary text-white placeholder-gray-500"
              />
              <button type="submit"
                className="bg-primary hover:bg-primary-dark px-3 py-2.5 rounded-r-md transition-colors">
                <Send size={16} className="text-white" />
              </button>
            </form>

            {/* Modules Quick Links */}
            <div className="mt-6">
              <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-3">Our Modules</h5>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Retail', to: '/retail' },
                  { label: 'Wholesale', to: '/wholesale' },
                  { label: 'Get Quote', to: '/request-quote' },
                  { label: 'Export/Import', to: '/export-import' },
                ].map(({ label, to }) => (
                  <Link key={to} to={to}
                    className="text-xs bg-gray-800 hover:bg-primary text-gray-300 hover:text-white px-2 py-1.5 rounded transition-colors text-center">
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <span>© Apse Shopping {new Date().getFullYear()}. All Rights Reserved.</span>
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="hover:text-gray-300 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-gray-300 transition-colors">Terms</Link>
            <Link to="/sitemap" className="hover:text-gray-300 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
