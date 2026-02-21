import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { User, Package, MapPin, Lock, LogOut, Edit3 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { getRealOrders } from '@/lib/ordersStore'
import toast from 'react-hot-toast'

type ProfileTab = 'profile' | 'orders' | 'addresses' | 'security'

// ─── Mock data ────────────────────────────────────────────────────────────────

const DEMO_ORDERS = [
  { id: 'APE-MC4X2', date: '2026-02-15', status: 'Delivered', total: 43598, items: 3 },
  { id: 'APE-LC9K1', date: '2026-01-28', status: 'Shipped', total: 8000, items: 1 },
  { id: 'APE-TR7Q8', date: '2026-01-10', status: 'Delivered', total: 15999, items: 2 },
]

const STATUS_COLORS: Record<string, string> = {
  Delivered: 'bg-green-100 text-green-700',
  Shipped: 'bg-blue-100 text-blue-700',
  Processing: 'bg-yellow-100 text-yellow-700',
  Cancelled: 'bg-red-100 text-red-700',
}

interface ProfileForm {
  firstName: string
  lastName: string
  email: string
  phone: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { user, logout, update } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<ProfileTab>(
    (location.state as { tab?: ProfileTab })?.tab ?? 'profile'
  )
  const [editing, setEditing] = useState(false)

  // Real orders from localStorage + demo fallback
  const realOrders = getRealOrders()
  const realOrderRows = realOrders.map(o => ({
    id: o.id,
    date: o.date.slice(0, 10),
    status: o.status,
    total: o.total,
    items: o.items.length,
  }))
  const allOrders = [...realOrderRows, ...DEMO_ORDERS]

  const displayName = user?.name ?? 'Guest'
  const displayEmail = user?.email ?? ''
  const nameParts = displayName.split(' ')

  const { register, handleSubmit, reset } = useForm<ProfileForm>({
    defaultValues: {
      firstName: nameParts[0] ?? '',
      lastName: nameParts.slice(1).join(' ') ?? '',
      email: displayEmail,
      phone: user?.phone ?? '',
    },
  })

  // Sync form when user changes
  useEffect(() => {
    if (user) {
      const parts = user.name.split(' ')
      reset({
        firstName: parts[0] ?? '',
        lastName: parts.slice(1).join(' ') ?? '',
        email: user.email,
        phone: user.phone,
      })
    }
  }, [user, reset])

  function saveProfile(data: ProfileForm) {
    update({ name: `${data.firstName} ${data.lastName}`.trim(), email: data.email, phone: data.phone })
    setEditing(false)
    toast.success('Profile updated successfully!')
  }

  function handleLogout() {
    logout()
    navigate('/')
    toast.success('Signed out')
  }

  const TABS: { key: ProfileTab; label: string; Icon: React.ElementType }[] = [
    { key: 'profile', label: 'My Profile', Icon: User },
    { key: 'orders', label: 'My Orders', Icon: Package },
    { key: 'addresses', label: 'Addresses', Icon: MapPin },
    { key: 'security', label: 'Security', Icon: Lock },
  ]

  const fieldClass = 'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-gray-50 disabled:text-gray-500'

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Top banner */}
          <div className="bg-gradient-to-r from-topbar to-navbarbottom rounded-2xl p-6 mb-6 text-white flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-black">{displayName.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h1 className="text-2xl font-black">{displayName}</h1>
              <p className="text-white/70 text-sm">{displayEmail} · Member since Jan 2025</p>
            </div>
            <button onClick={handleLogout} className="ml-auto flex items-center gap-1.5 text-white/70 hover:text-white text-sm transition-colors">
              <LogOut size={15} /> Logout
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar nav */}
            <nav className="md:col-span-1">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                {TABS.map(({ key, label, Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium border-l-4 transition-colors ${
                      activeTab === key
                        ? 'border-primary text-primary bg-primary/5'
                        : 'border-transparent text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                ))}
              </div>
            </nav>

            {/* Content */}
            <div className="md:col-span-3">

              {/* ── Profile tab ── */}
              {activeTab === 'profile' && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold">Personal Information</h2>
                    <button
                      onClick={() => setEditing(!editing)}
                      className="flex items-center gap-1.5 text-sm text-primary hover:text-primary-dark transition-colors"
                    >
                      <Edit3 size={14} /> {editing ? 'Cancel' : 'Edit'}
                    </button>
                  </div>
                  <form onSubmit={handleSubmit(saveProfile)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                        <input {...register('firstName', { required: true })}
                          disabled={!editing} className={fieldClass} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                        <input {...register('lastName', { required: true })}
                          disabled={!editing} className={fieldClass} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                        <input {...register('email', { required: true })}
                          type="email" disabled={!editing} className={fieldClass} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                        <input {...register('phone')}
                          disabled={!editing} className={fieldClass} />
                      </div>
                    </div>
                    {editing && (
                      <button type="submit" className="btn-primary px-6 py-2.5 text-sm">
                        Save Changes
                      </button>
                    )}
                  </form>
                </div>
              )}

              {/* ── Orders tab ── */}
              {activeTab === 'orders' && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                  <h2 className="text-lg font-bold mb-5">Order History</h2>
                  {allOrders.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <Package size={40} className="mx-auto mb-3 opacity-30" />
                      <p>No orders yet.</p>
                      <Link to="/retail" className="btn-primary mt-4 text-sm">Start Shopping</Link>
                    </div>
                  ) : (
                  <div className="space-y-4">
                      {allOrders.map(order => (
                        <div key={order.id} className="border border-gray-100 rounded-xl p-4 flex flex-wrap items-center gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-primary text-sm">{order.id}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_COLORS[order.status]}`}>
                                {order.status}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400">{order.date} · {order.items} item{order.items > 1 ? 's' : ''}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-accent">₹{order.total.toLocaleString('en-IN')}</p>
                            <Link to={`/track-order?id=${order.id}`} className="text-xs text-primary hover:underline">
                              Track Order →
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── Addresses tab ── */}
              {activeTab === 'addresses' && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold">Saved Addresses</h2>
                    <button className="btn-outline text-xs px-4 py-2">+ Add New</button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: 'Home', address: '12, MG Road, Hubli, Karnataka – 580023', isDefault: true },
                      { label: 'Office', address: 'Block B, Tech Park, Bengaluru, Karnataka – 560001', isDefault: false },
                    ].map(addr => (
                      <div key={addr.label} className="border border-gray-200 rounded-xl p-4 relative">
                        {addr.isDefault && (
                          <span className="absolute top-3 right-3 text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                        <p className="font-bold text-sm mb-1 flex items-center gap-1">
                          <MapPin size={13} className="text-primary" /> {addr.label}
                        </p>
                        <p className="text-sm text-gray-500">{addr.address}</p>
                        <div className="flex gap-3 mt-3">
                          <button className="text-xs text-primary hover:underline">Edit</button>
                          {!addr.isDefault && <button className="text-xs text-gray-400 hover:text-red-500">Remove</button>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Security tab ── */}
              {activeTab === 'security' && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
                  <h2 className="text-lg font-bold">Security Settings</h2>

                  <div className="border border-gray-100 rounded-xl p-5">
                    <h3 className="font-semibold mb-4">Change Password</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
                        <input type="password" className={fieldClass} placeholder="••••••••" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                        <input type="password" className={fieldClass} placeholder="••••••••" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
                        <input type="password" className={fieldClass} placeholder="••••••••" />
                      </div>
                      <button
                        onClick={() => toast.success('Password updated!')}
                        className="btn-primary text-sm px-6 py-2.5">
                        Update Password
                      </button>
                    </div>
                  </div>

                  <div className="border border-gray-100 rounded-xl p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-400 mt-0.5">Add an extra layer of security to your account.</p>
                      </div>
                      <button
                        onClick={() => toast.success('2FA enabled!')}
                        className="btn-outline text-sm px-4 py-2">
                        Enable 2FA
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
