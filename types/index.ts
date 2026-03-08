// =============================================
// V-Node Dynamics — Core TypeScript Interfaces
// =============================================

export interface Category {
    id: string;
    name: string;
    slug: string;
    created_at: string;
}

export interface Brand {
    id: string;
    name: string;
    slug: string;
    logo_url?: string;
    description?: string;
    country?: string;
    is_featured: boolean;
    product_count?: number;
}


export interface NutritionFact {
    name: string;
    amount: number | string;
    unit: string;
    dailyValuePct?: number;
    bold?: boolean;    // Renders with heavier border and bold text
    indent?: boolean;  // Renders indented (sub-nutrient)
}

export interface ProductBenefit {
    icon: string;       // Emoji e.g. "💪"
    title: string;
    description: string;
}

export interface ProductImage {
    url: string;
    alt: string;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    long_description?: string;    // Expanded markdown-capable text
    category_id: string | null;
    brand_id?: string;
    base_price: number;
    mrp?: number;                 // Max Retail Price for strikethrough display
    price_per_unit?: string;    // e.g. "₹3.7/count"
    image_url: string | null;
    images?: ProductImage[];      // Gallery images (first = main)
    is_featured: boolean;
    rating: number;
    review_count: number;
    badges?: string[];            // e.g. ['BEST SELLER', 'HEAVY METALS TESTED']
    certifications?: string[];  // e.g. ['FSSAI', 'NSF', 'INFORMED SPORT']
    nutrition?: {
        servingSize: string;
        servingsPerContainer: number;
        facts: NutritionFact[];
    };
    benefits?: ProductBenefit[];
    how_to_use?: string[];        // Step-by-step usage
    highlights?: string[];      // Short bullet points
    ingredients?: string;       // Ingredient list text
    best_before?: string;       // e.g. "Jan 2027"
    stock?: number;
    created_at: string;
    updated_at: string;
    // Joined fields
    category?: Category;
    brand?: Brand;
}

export interface ProductVariant {
    id: string;
    product_id: string;
    flavor: string;
    size: string;
    price_adjustment: number;
    stock: number;
    sku: string | null;
    created_at: string;
}

export interface CartItem {
    variantId: string;
    productId: string;
    productName: string;
    productSlug: string;
    imageUrl: string | null;
    flavor: string;
    size: string;
    price: number;   // final price (base_price + price_adjustment)
    quantity: number;
    maxStock?: number; // Added to prevent checking out more than available
    isFree?: boolean; // For GWP free items
}

export interface CartState {
    items: CartItem[];
    isOpen: boolean;
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (variantId: string) => void;
    updateQuantity: (variantId: string, quantity: number) => void;
    clearCart: () => void;
    toggleCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    totalItems: () => number;
    totalPrice: () => number;
}

// ─── Admin CMS Types ─────────────────────────────────────────────────────────

export interface PromoBanner {
    id: string;
    tag: string;          // e.g. "Limited Time"
    title: string;
    subtitle: string;
    couponCode?: string;
    bgGradient: string;   // Tailwind gradient class
    isActive: boolean;
    sortOrder: number;
}

export interface Coupon {
    id: string;
    code: string;
    type: 'percent' | 'flat';
    value: number;
    label: string;
    minOrder?: number;
    maxUses?: number;
    usedCount: number;
    expiresAt?: string;   // ISO date string
    isActive: boolean;
    productSpecific?: string[]; // product IDs (empty = sitewide)
}

export interface GWPOffer {
    id: string;
    name: string;
    triggerProductId: string;
    triggerMinQty: number;
    rewardProductId: string;
    rewardQty: number;
    isActive: boolean;
}

export interface FlashDeal {
    id: string;
    productId: string;
    salePrice: number;
    startsAt: string;
    endsAt: string;
    isActive: boolean;
}

// ─── Order Types ──────────────────────────────────────────────────────────────

export type OrderStatus = 'pending' | 'confirmed' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'refunded';

export interface Order {
    id: string;
    items: CartItem[];
    total: number;
    status: OrderStatus;
    address: {
        name: string;
        phone: string;
        line1: string;
        city: string;
        state: string;
        pincode: string;
    };
    paymentId?: string;
    createdAt: string;
    updatedAt: string;
}

// Admin form types
export interface NewProductFormData {
    name: string;
    slug: string;
    description: string;
    category_id: string;
    base_price: number;
    is_featured: boolean;
    imageFile?: File;
    variants: {
        flavor: string;
        size: string;
        price_adjustment: number;
        stock: number;
    }[];
}
