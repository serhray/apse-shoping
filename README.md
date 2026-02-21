# Apse Shopping — Full-Stack React E-Commerce Platform

A production-ready multi-module e-commerce web application built with **React 18 + TypeScript + Vite + Tailwind CSS**.  
Inspired by [apseshopping.com](https://apseshopping.com/) with an improved, modern design system.

---

## 🗺️ Roadmap & Modules

| # | Module | Status | Route |
|---|--------|--------|-------|
| 1 | **E-Commerce: Retail & Wholesale** | ✅ Done | `/retail`, `/wholesale` |
| 2 | **Request for Quote (All Trades)** | ✅ Done | `/request-quote` |
| 3 | **Services & Pre-Owned** | ✅ Done | `/services` |
| 4 | **Export & Import** | ✅ Done | `/export-import` |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 18 + TypeScript |
| Bundler | Vite 5 |
| Styling | Tailwind CSS 3 |
| Routing | React Router v6 |
| Forms | React Hook Form |
| State | Context API + useReducer (cart) |
| Notifications | react-hot-toast |
| Carousel | Swiper.js |
| Icons | Lucide React |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/          ← TopBar, Header, Footer, Layout
│   ├── home/            ← HeroSlider, FeatureStrip, PromoBanners,
│   │                       PopularProducts, NewArrivals, TopCategories,
│   │                       FashionDeals, ProductTabs
│   └── ui/              ← ProductCard, CategoryCard, StarRating
├── context/
│   └── CartContext.tsx  ← Cart state (localStorage-persisted)
├── data/
│   └── mockData.ts      ← Products, categories, services, hero slides
├── lib/
│   └── utils.ts         ← cn(), formatPrice(), truncate()
├── pages/
│   ├── retail/          ← RetailPage, WholesalePage, CategoryPage,
│   │                       ProductDetailPage
│   ├── quote/           ← RequestQuotePage
│   ├── services/        ← ServicesPreOwnedPage
│   ├── export-import/   ← ExportImportPage
│   ├── Home.tsx
│   ├── CartPage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── ContactPage.tsx
│   └── SearchPage.tsx
└── types/
    └── index.ts         ← All TypeScript interfaces
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js ≥ 18.x
- npm ≥ 9.x

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open in browser
# http://localhost:5173

# 4. Build for production
npm run build

# 5. Preview production build
npm run preview
```

---

## ➕ Adding New Pages

1. **Create the page** in `src/pages/your-module/YourPage.tsx`
2. **Register the route** in `src/App.tsx` inside the `<Route element={<Layout />}>` block
3. **Add nav link** in `src/components/layout/Header.tsx` nav arrays

### Example — Adding a Blog page:
```tsx
// src/pages/BlogPage.tsx
export default function BlogPage() {
  return <div>Blog content</div>
}

// src/App.tsx — add inside <Layout> route:
<Route path="blog" element={<BlogPage />} />

// src/components/layout/Header.tsx — add to nav arrays:
{ label: 'BLOG', to: '/blog' }
```

---

## 🗄️ Connecting a Backend / API

The project is fully API-ready. Replace mock data in `src/data/mockData.ts` with real API calls:

```tsx
// Recommended: use React Query for async data
import { useQuery } from '@tanstack/react-query'

const { data: products } = useQuery({
  queryKey: ['products'],
  queryFn: () => fetch('/api/products').then(r => r.json()),
})
```

Install React Query: `npm install @tanstack/react-query`

---

## 🔐 Authentication (future)

The project is structured to add auth easily:
- `LoginPage.tsx` and `RegisterPage.tsx` already exist with form validation
- Add a `AuthContext.tsx` alongside `CartContext.tsx`
- Wrap protected routes with a `<PrivateRoute>` component

---

## 📦 Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=https://your-api.com
VITE_GOOGLE_MAPS_KEY=your_key_here
```

Access in code: `import.meta.env.VITE_API_BASE_URL`

---

## 📞 Contact

**Apse Shopping** — Shop No 4, Harsha Residency, Devangpeth Road, Hubli 580023, Karnataka, India  
📞 8073667950 | 📧 contact@apseshopping.com
