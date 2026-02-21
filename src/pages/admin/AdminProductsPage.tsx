import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { getProducts, deleteProduct, updateProduct, addProduct } from '@/lib/adminStore'
import { CATEGORIES } from '@/data/mockData'
import type { Product } from '@/types'
import { Plus, Pencil, Trash2, Search, X, PackageSearch, Check } from 'lucide-react'
import toast from 'react-hot-toast'

type FormData = {
  name: string
  slug: string
  image: string
  price: number
  originalPrice: number
  discount: number
  category: string
  categorySlug: string
  stock: number
  description: string
  moq: number
  wholesalePrice: number
  condition: 'new' | 'pre-owned' | 'refurbished'
  tags: string
  isNew: boolean
  isFeatured: boolean
  isBestSeller: boolean
  isTopRated: boolean
}

const STATUS_COLOR: Record<string, string> = {
  new: 'bg-green-100 text-green-700',
  'pre-owned': 'bg-amber-100 text-amber-700',
  refurbished: 'bg-purple-100 text-purple-700',
}

function generateId() {
  return 'P' + Date.now().toString(36).toUpperCase()
}

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

// ─── Product Form Modal ───────────────────────────────────────────────────────
function ProductModal({
  product,
  onClose,
  onSave,
}: {
  product: Product | null
  onClose: () => void
  onSave: (p: Product) => void
}) {
  const isEdit = !!product
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: product
      ? {
          ...product,
          tags: product.tags?.join(', ') ?? '',
          price: product.price,
          originalPrice: product.originalPrice ?? 0,
          discount: product.discount ?? 0,
          moq: product.moq ?? 1,
          wholesalePrice: product.wholesalePrice ?? 0,
        }
      : {
          condition: 'new',
          isNew: false, isFeatured: false, isBestSeller: false, isTopRated: false,
          discount: 0, moq: 1, wholesalePrice: 0,
        },
  })

  const nameVal = watch('name')

  function onSubmit(data: FormData) {
    const catObj = CATEGORIES.find(c => c.slug === data.categorySlug)
    const p: Product = {
      id: product?.id ?? generateId(),
      name: data.name,
      slug: data.slug || toSlug(data.name),
      image: data.image,
      price: Number(data.price),
      originalPrice: Number(data.originalPrice) || undefined,
      discount: Number(data.discount) || undefined,
      category: catObj?.name ?? data.category,
      categorySlug: data.categorySlug,
      stock: Number(data.stock),
      description: data.description,
      moq: Number(data.moq) || undefined,
      wholesalePrice: Number(data.wholesalePrice) || undefined,
      condition: data.condition,
      tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      isNew: data.isNew,
      isFeatured: data.isFeatured,
      isBestSeller: data.isBestSeller,
      isTopRated: data.isTopRated,
      rating: product?.rating ?? 0,
      reviews: product?.reviews ?? 0,
    }
    onSave(p)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto py-8 px-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div className="sm:col-span-2">
              <label className="label">Product Name *</label>
              <input {...register('name', { required: true })}
                onBlur={() => { if (!isEdit) setValue('slug', toSlug(nameVal)) }}
                className="input w-full" placeholder="e.g. Canon EOS R100" />
              {errors.name && <span className="text-xs text-red-500">Required</span>}
            </div>

            {/* Slug */}
            <div>
              <label className="label">Slug (URL)</label>
              <input {...register('slug')} className="input w-full" placeholder="auto-generated" />
            </div>

            {/* Image URL */}
            <div>
              <label className="label">Image URL *</label>
              <input {...register('image', { required: true })} className="input w-full" placeholder="https://..." />
              {errors.image && <span className="text-xs text-red-500">Required</span>}
            </div>

            {/* Price */}
            <div>
              <label className="label">Price (₹) *</label>
              <input {...register('price', { required: true, min: 1 })} type="number" className="input w-full" />
              {errors.price && <span className="text-xs text-red-500">Required</span>}
            </div>

            {/* Original Price */}
            <div>
              <label className="label">Original Price (₹)</label>
              <input {...register('originalPrice')} type="number" className="input w-full" />
            </div>

            {/* Discount */}
            <div>
              <label className="label">Discount %</label>
              <input {...register('discount')} type="number" min="0" max="100" className="input w-full" />
            </div>

            {/* Stock */}
            <div>
              <label className="label">Stock *</label>
              <input {...register('stock', { required: true, min: 0 })} type="number" className="input w-full" />
            </div>

            {/* Category */}
            <div>
              <label className="label">Category *</label>
              <select {...register('categorySlug', { required: true })} className="input w-full"
                onChange={e => {
                  const cat = CATEGORIES.find(c => c.slug === e.target.value)
                  if (cat) setValue('category', cat.name)
                }}>
                <option value="">Select category…</option>
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Condition */}
            <div>
              <label className="label">Condition *</label>
              <select {...register('condition')} className="input w-full">
                <option value="new">New</option>
                <option value="pre-owned">Pre-Owned</option>
                <option value="refurbished">Refurbished</option>
              </select>
            </div>

            {/* Wholesale Price */}
            <div>
              <label className="label">Wholesale Price (₹)</label>
              <input {...register('wholesalePrice')} type="number" className="input w-full" />
            </div>

            {/* MOQ */}
            <div>
              <label className="label">Min Order Qty (Wholesale)</label>
              <input {...register('moq')} type="number" min="1" className="input w-full" />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="label">Description *</label>
              <textarea {...register('description', { required: true })} rows={3} className="input w-full resize-none" />
            </div>

            {/* Tags */}
            <div className="sm:col-span-2">
              <label className="label">Tags (comma separated)</label>
              <input {...register('tags')} className="input w-full" placeholder="e.g. camera, canon, photography" />
            </div>

            {/* Flags */}
            <div className="sm:col-span-2">
              <label className="label mb-2">Product Flags</label>
              <div className="flex flex-wrap gap-4">
                {(['isNew', 'isFeatured', 'isBestSeller', 'isTopRated'] as const).map(flag => (
                  <label key={flag} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                    <input type="checkbox" {...register(flag)} className="accent-primary w-4 h-4" />
                    {flag.replace(/^is/, '')}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <button type="button" onClick={onClose} className="btn-outline px-5 py-2 text-sm">Cancel</button>
            <button type="submit" className="btn-primary px-6 py-2 text-sm flex items-center gap-2">
              <Check size={16} /> {isEdit ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminProductsPage() {
  const [products, setProducts] = useState(() => getProducts())
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('')
  const [modalProduct, setModalProduct] = useState<Product | null | undefined>(undefined) // undefined = closed, null = new
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  function refresh() { setProducts(getProducts()) }

  const filtered = products.filter(p => {
    const s = search.toLowerCase()
    const matchSearch = !s || p.name.toLowerCase().includes(s) || p.id.toLowerCase().includes(s)
    const matchCat = !catFilter || p.categorySlug === catFilter
    return matchSearch && matchCat
  })

  function handleSave(p: Product) {
    if (products.find(x => x.id === p.id)) {
      updateProduct(p)
      toast.success('Product updated!')
    } else {
      addProduct(p)
      toast.success('Product added!')
    }
    refresh()
    setModalProduct(undefined)
  }

  function handleDelete(id: string) {
    deleteProduct(id)
    toast.success('Product deleted.')
    refresh()
    setConfirmDelete(null)
  }

  function handleReset() {
    localStorage.removeItem('apse_products')
    refresh()
    toast('Products reset to defaults.')
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">{products.length} total products</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleReset} className="btn-outline text-xs px-3 py-2">Reset to Defaults</button>
          <button onClick={() => setModalProduct(null)} className="btn-primary text-sm px-4 py-2 flex items-center gap-2">
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or ID…"
            className="input w-full pl-8 text-sm py-2"
          />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="input text-sm py-2 w-auto">
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
        </select>
        {(search || catFilter) && (
          <button onClick={() => { setSearch(''); setCatFilter('') }} className="text-sm text-primary hover:underline flex items-center gap-1">
            <X size={13} /> Clear
          </button>
        )}
        <span className="text-sm text-gray-400 ml-auto">{filtered.length} results</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <PackageSearch size={48} className="mx-auto text-gray-200 mb-3" />
            <p className="text-gray-400 font-medium">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Product</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Category</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Price</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Stock</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Condition</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Flags</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover border border-gray-100 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 truncate max-w-[220px]">{p.name}</p>
                          <p className="text-xs text-gray-400">{p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.category}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-bold text-gray-900">₹{p.price.toLocaleString()}</span>
                      {p.originalPrice && (
                        <span className="block text-xs text-gray-400 line-through">₹{p.originalPrice.toLocaleString()}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-semibold ${p.stock <= 5 ? 'text-red-600' : 'text-gray-800'}`}>{p.stock}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLOR[p.condition ?? 'new']}`}>
                        {p.condition ?? 'new'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-1 flex-wrap">
                        {p.isNew && <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">New</span>}
                        {p.isFeatured && <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">Featured</span>}
                        {p.isBestSeller && <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">Best</span>}
                        {p.isTopRated && <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">Top</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setModalProduct(p)}
                          className="p-1.5 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(p.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {modalProduct !== undefined && (
        <ProductModal
          product={modalProduct}
          onClose={() => setModalProduct(undefined)}
          onSave={handleSave}
        />
      )}

      {/* Delete Confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <Trash2 size={36} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Product?</h3>
            <p className="text-sm text-gray-500 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setConfirmDelete(null)} className="btn-outline px-5">Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)} className="bg-red-500 text-white font-bold px-5 py-2 rounded-lg hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
