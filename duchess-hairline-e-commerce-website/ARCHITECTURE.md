# Duchess Hairline — code guide

A short map of the project, written for whoever adds the backend.

## Folder layout

```
src/
├── config/          Content and settings a non-developer may edit
│   ├── business.ts    Name, phone, address, socials, hours, route table
│   ├── categories.ts  Wig categories used by nav and filters
│   └── media.ts       Every image URL in one registry
├── types/           Shared TypeScript types (Product, Category, ProductQuery)
├── data/
│   └── products.seed.ts   The catalogue while there is no backend
├── services/        Data access. The only layer that knows where data lives
│   ├── http.ts            fetch wrapper + API base URL
│   └── productService.ts  listProducts / getProduct / listRelated
├── hooks/           React bindings for the services
│   ├── useProducts.ts     useProducts, useProduct, useProductSearch
│   └── useInView.ts       Scroll reveal
├── lib/
│   └── whatsapp.ts  Builds every wa.me, tel: and maps link
├── components/      Reusable UI
└── pages/           One file per route
```

The dependency direction is one way:

```
pages → hooks → services → (seed data | HTTP API)
```

Pages never import seed data and never call `fetch`. That is what makes the
backend swap contained.

## Adding a backend

**1. Point the app at your API**

Create `.env`:

```
VITE_API_URL=https://api.duchesshairline.com
```

`src/services/http.ts` reads this. When it is set, `hasRemoteApi` becomes true
and `productService` automatically takes its remote branch. Nothing else needs
to change.

**2. Match these endpoints**

| Method | Path                     | Returns          | Notes                                    |
| ------ | ------------------------ | ---------------- | ---------------------------------------- |
| GET    | `/products`              | `Product[]`      | Accepts `category`, `search`, `featured`, `newArrival`, `bestSeller`, `availableOnly`, `sort`, `limit` as query params |
| GET    | `/products/:id`          | `Product | null` | 404 or `null` renders the not-found state |
| GET    | `/products/:id/related`  | `Product[]`      | Accepts `limit`                          |

The `Product` shape is defined once in `src/types/index.ts`. Keep the API
response identical to it and no mapping code is needed.

**3. Optional: keep the seed as a fallback**

`productService` currently branches on `hasRemoteApi`. If you want offline
resilience, wrap the remote call in a `try/catch` and fall back to the seed
branch on failure.

## Things worth knowing

- **Async from day one.** Service functions already return promises and the
  hooks already expose `loading` and `error`, so introducing real network
  latency does not require touching any component.
- **Prices may be `null`.** That renders "Price on request". Never substitute a
  placeholder number.
- **Unknown specs are `null`,** and the product page hides them rather than
  printing "Unknown".
- **Routes live in `config/business.ts`.** Use `routes.collection` instead of
  hard-coding `/collection` so a rename stays a one-line change.
- **`HashRouter`** is used so the built single file works when opened without a
  server. Switch to `BrowserRouter` once the site is hosted with a rewrite rule.

## Content the owner should update before launch

- `config/business.ts` → `hours` are placeholders and need confirming.
- `config/media.ts` → replace stock photography with real product photos.
- `data/products.seed.ts` → real names, prices and specifications.
- `pages/Reviews.tsx` → review and gallery slots are deliberately empty until
  verified customer content exists.
