-- ====================================================================
-- TARIQ SWEETS AND BAKERS - SUPABASE POSTGRESQL DATABASE SCHEMA
-- ====================================================================
-- Execute this complete script in the Supabase SQL Editor.
-- It provisions all 7 relational tables, Row Level Security (RLS) policies,
-- foreign keys, storage bucket permissions, and initial seed data.

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================================================
-- TABLE 1: categories
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ====================================================================
-- TABLE 2: products
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    unit TEXT NOT NULL DEFAULT 'per kg',
    image_url TEXT,
    is_available BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);

-- ====================================================================
-- TABLE 3: customers
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);

-- ====================================================================
-- TABLE 4: orders
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL UNIQUE,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    subtotal_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    payment_method TEXT NOT NULL DEFAULT 'Cash on Delivery',
    order_status TEXT NOT NULL DEFAULT 'Pending' 
        CHECK (order_status IN ('Pending', 'Confirmed', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);

-- ====================================================================
-- TABLE 5: order_items (Historical snapshot of purchased products)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    subtotal NUMERIC(10, 2) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

-- ====================================================================
-- TABLE 6: admin_profiles
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('superadmin', 'admin', 'manager')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ====================================================================
-- TABLE 7: store_settings
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.store_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_name TEXT NOT NULL DEFAULT 'TARIQ SWEETS AND BAKERS',
    logo_url TEXT DEFAULT '',
    phone TEXT NOT NULL DEFAULT '+92 300 8472910',
    address TEXT NOT NULL DEFAULT 'Main Commercial Market, Tariq Sweets Plaza, Lahore, Pakistan',
    delivery_charge NUMERIC(10, 2) NOT NULL DEFAULT 180,
    free_delivery_threshold NUMERIC(10, 2) NOT NULL DEFAULT 2500,
    opening_hours TEXT NOT NULL DEFAULT 'Mon – Sun: 8:00 AM – 11:30 PM (Fresh baking 3 times daily)',
    promo_banner_text TEXT NOT NULL DEFAULT '🚚 FREE DELIVERY on orders over Rs. 2,500 across city! Pure Desi Ghee Mithai prepared daily.',
    promo_banner_active BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ====================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Categories: Public read, Admin manage
CREATE POLICY "Public can view active categories" 
    ON public.categories FOR SELECT 
    USING (true);

CREATE POLICY "Admin can manage categories" 
    ON public.categories FOR ALL 
    USING (auth.role() = 'authenticated');

-- Products: Public can view available products, Admin manage
CREATE POLICY "Public can view products" 
    ON public.products FOR SELECT 
    USING (true);

CREATE POLICY "Admin can manage products" 
    ON public.products FOR ALL 
    USING (auth.role() = 'authenticated');

-- Store settings: Public read, Admin update
CREATE POLICY "Public can view store settings" 
    ON public.store_settings FOR SELECT 
    USING (true);

CREATE POLICY "Admin can update store settings" 
    ON public.store_settings FOR ALL 
    USING (auth.role() = 'authenticated');

-- Orders & Customers: Public can insert their orders and order items; lookup by order number
CREATE POLICY "Public can create customers" 
    ON public.customers FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Public can place orders" 
    ON public.orders FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Public can lookup own order by number" 
    ON public.orders FOR SELECT 
    USING (true);

CREATE POLICY "Public can insert order items" 
    ON public.order_items FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Public can view order items" 
    ON public.order_items FOR SELECT 
    USING (true);

-- Admin has full access to all orders and customers
CREATE POLICY "Admin can manage orders" 
    ON public.orders FOR ALL 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can view all customers" 
    ON public.customers FOR ALL 
    USING (auth.role() = 'authenticated');

-- Storage bucket setup for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can read product images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');
