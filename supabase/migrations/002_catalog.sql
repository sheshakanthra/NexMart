-- Phase 2: Catalog Management
-- Tables: categories, stores, products, inventory
-- Depends on: 001_profiles.sql (requires update_updated_at_column, get_my_role)

-- ─── Storage bucket ───────────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880, -- 5 MB
  ARRAY['image/jpeg','image/png','image/webp','image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to product-images
CREATE POLICY "product_images_upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images');

-- Allow anyone to read from product-images (public bucket)
CREATE POLICY "product_images_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Allow owners to delete their own uploads
CREATE POLICY "product_images_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ─── Categories ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.categories (
  id         TEXT        PRIMARY KEY,
  name       TEXT        NOT NULL,
  icon       TEXT,
  sort_order INT         DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "categories_read_all"
  ON public.categories FOR SELECT USING (true);

CREATE POLICY "categories_admin_write"
  ON public.categories FOR ALL
  USING (public.get_my_role() = 'admin');

-- ─── Stores ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.stores (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id           UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  name               TEXT        NOT NULL,
  owner_name         TEXT,
  neighborhood       TEXT,
  rating             NUMERIC(3,2) DEFAULT 4.5,
  distance_km        NUMERIC(5,2) DEFAULT 1.0,
  eta_min            INT          DEFAULT 20,
  open               BOOLEAN      DEFAULT true,
  delivery_radius_km NUMERIC(5,2) DEFAULT 3.0,
  hours              TEXT         DEFAULT '7:00 AM – 10:00 PM',
  status             TEXT         DEFAULT 'active'
                       CHECK (status IN ('active','inactive','pending')),
  tags               TEXT[]       DEFAULT '{}',
  cover_url          TEXT,
  health_score       INT          DEFAULT 80,
  description        TEXT,
  created_at         TIMESTAMPTZ  DEFAULT now(),
  updated_at         TIMESTAMPTZ  DEFAULT now(),
  deleted_at         TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS stores_owner_id_idx      ON public.stores (owner_id);
CREATE INDEX IF NOT EXISTS stores_neighborhood_idx  ON public.stores (neighborhood);
CREATE INDEX IF NOT EXISTS stores_status_idx        ON public.stores (status);

ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

-- Anyone can read active, non-deleted stores
CREATE POLICY "stores_read_active"
  ON public.stores FOR SELECT
  USING (status = 'active' AND deleted_at IS NULL);

-- Vendors can see their own stores (any status)
CREATE POLICY "stores_vendor_select_own"
  ON public.stores FOR SELECT
  USING (owner_id = auth.uid());

-- Vendors can update their own stores
CREATE POLICY "stores_vendor_update_own"
  ON public.stores FOR UPDATE
  USING  (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- Admin: full access
CREATE POLICY "stores_admin_all"
  ON public.stores FOR ALL
  USING (public.get_my_role() = 'admin');

-- ─── Products ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.products (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id    UUID        NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  category_id TEXT        REFERENCES public.categories(id) ON DELETE SET NULL,
  name        TEXT        NOT NULL,
  price       NUMERIC(10,2) NOT NULL,
  unit        TEXT          DEFAULT '1 unit',
  image_url   TEXT,
  description TEXT,
  active      BOOLEAN       DEFAULT true,
  trend       JSONB         DEFAULT '[10,12,14,13,15,18,20]',
  sold_today  INT           DEFAULT 0,
  created_at  TIMESTAMPTZ   DEFAULT now(),
  updated_at  TIMESTAMPTZ   DEFAULT now(),
  deleted_at  TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS products_store_id_idx    ON public.products (store_id);
CREATE INDEX IF NOT EXISTS products_category_id_idx ON public.products (category_id);
CREATE INDEX IF NOT EXISTS products_active_idx      ON public.products (active) WHERE active = true;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Customers/anon: active products from active stores
CREATE POLICY "products_read_active"
  ON public.products FOR SELECT
  USING (
    active = true
    AND deleted_at IS NULL
    AND EXISTS (
      SELECT 1 FROM public.stores s
      WHERE s.id = products.store_id
        AND s.status = 'active'
        AND s.deleted_at IS NULL
    )
  );

-- Vendors: full control over their own store's products
CREATE POLICY "products_vendor_select_own"
  ON public.products FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.stores s WHERE s.id = products.store_id AND s.owner_id = auth.uid())
  );

CREATE POLICY "products_vendor_insert_own"
  ON public.products FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.stores s WHERE s.id = products.store_id AND s.owner_id = auth.uid())
  );

CREATE POLICY "products_vendor_update_own"
  ON public.products FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.stores s WHERE s.id = products.store_id AND s.owner_id = auth.uid())
  );

CREATE POLICY "products_vendor_delete_own"
  ON public.products FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.stores s WHERE s.id = products.store_id AND s.owner_id = auth.uid())
  );

-- Admin: full access
CREATE POLICY "products_admin_all"
  ON public.products FOR ALL
  USING (public.get_my_role() = 'admin');

-- ─── Inventory ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.inventory (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID        NOT NULL UNIQUE REFERENCES public.products(id) ON DELETE CASCADE,
  stock       INT         DEFAULT 0 CHECK (stock >= 0),
  threshold   INT         DEFAULT 5,
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS inventory_product_id_idx ON public.inventory (product_id);

ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- Customers/anon: can read stock for active products
CREATE POLICY "inventory_read_active"
  ON public.inventory FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.products p
      JOIN  public.stores s ON s.id = p.store_id
      WHERE p.id = inventory.product_id
        AND p.active = true
        AND p.deleted_at IS NULL
        AND s.status = 'active'
        AND s.deleted_at IS NULL
    )
  );

-- Vendors: manage inventory for their own stores
CREATE POLICY "inventory_vendor_select_own"
  ON public.inventory FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.products p
      JOIN  public.stores s ON s.id = p.store_id
      WHERE p.id = inventory.product_id AND s.owner_id = auth.uid()
    )
  );

CREATE POLICY "inventory_vendor_insert_own"
  ON public.inventory FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.products p
      JOIN  public.stores s ON s.id = p.store_id
      WHERE p.id = inventory.product_id AND s.owner_id = auth.uid()
    )
  );

CREATE POLICY "inventory_vendor_update_own"
  ON public.inventory FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.products p
      JOIN  public.stores s ON s.id = p.store_id
      WHERE p.id = inventory.product_id AND s.owner_id = auth.uid()
    )
  );

-- Admin: full access
CREATE POLICY "inventory_admin_all"
  ON public.inventory FOR ALL
  USING (public.get_my_role() = 'admin');

-- ─── Triggers (reuse function from 001) ───────────────────────────────────────
CREATE OR REPLACE TRIGGER set_stores_updated_at
  BEFORE UPDATE ON public.stores
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER set_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER set_inventory_updated_at
  BEFORE UPDATE ON public.inventory
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
