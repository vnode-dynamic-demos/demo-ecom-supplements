# Managing Mock Product Data

This project comes pre-configured with rich Mock Data to ensure the storefront always looks spectacular out-of-the-box, even before the real database is fully populated.

## Where does the Mock Data live?
All hardcoded mock data for products, categories, and brands is located in a single file:
`lib/products.ts`

Inside this file, you will find a primary array called `MOCK_PRODUCTS`. Every item in this array corresponds to a product card you see on the storefront.

## How the Fallback Works
By default, the application is designed to be highly resilient:
1. It attempts to fetch products from your **Supabase Database**.
2. If Supabase is **not connected** (missing `.env` variables) or if the query returns **fewer than 5 products** (indicating an empty initial database), the code seamlessly falls back to returning the `MOCK_PRODUCTS` array.

This guarantees your demo, search autocomplete, and product grids always work flawlessly.

## How to Add or Edit Mock Products
To add a new mock product for testing, simply locate the `MOCK_PRODUCTS` array in `lib/products.ts` and append a new object. 

```typescript
{
    id: `prod-${Date.now()}`,
    slug: 'my-new-product',
    name: 'My Custom Product Name',
    description: 'A great description for my test product.',
    base_price: 1999,
    mrp: 2499,
    category_id: 'cat-protein',
    brand: { id: 'b-custom', name: 'Custom Brand', slug: 'custom-brand' },
    images: [{ url: 'https://placehold.co/600x600/png', alt: 'Test Product' }],
    rating: 4.8,
    review_count: 150,
    is_active: true,
    created_at: new Date().toISOString()
}
```

## Transitioning to Pure Production Mode (Removing Mock Data)
When you are ready to launch and want the application to **strictly** use real data from your Supabase database (even if it's empty), simply remove the fallback logic from the fetcher functions in `lib/products.ts`.

Find `getAllProducts` and `getFeaturedProducts` and remove these lines:
```typescript
// Graceful fallback: If the live DB is virtually empty, fall back to rich mock data for the UI.
if (!data || data.length < 5) return MOCK_PRODUCTS;
```

Once removed, your storefront will immediately reflect the exact contents of your live Supabase database.
