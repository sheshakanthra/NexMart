-- NexMart Seed Data
-- Run after migrations. Idempotent (ON CONFLICT DO NOTHING).
-- All store/product IDs use deterministic UUIDs for repeatability.

-- ─── Categories ───────────────────────────────────────────────────────────────
INSERT INTO public.categories (id, name, icon, sort_order) VALUES
  ('staples',   'Staples & Grains',    'Wheat',    1),
  ('dairy',     'Dairy & Eggs',        'Milk',     2),
  ('produce',   'Fruits & Vegetables', 'Apple',    3),
  ('spices',    'Spices & Masalas',    'Flame',    4),
  ('snacks',    'Snacks & Namkeen',    'Cookie',   5),
  ('beverages', 'Beverages',           'CupSoda',  6),
  ('personal',  'Personal Care',       'Sparkles', 7),
  ('household', 'Household',           'Home',     8)
ON CONFLICT (id) DO NOTHING;

-- ─── Stores (4 demo stores across Chennai) ────────────────────────────────────
INSERT INTO public.stores (id, name, owner_name, neighborhood, rating, distance_km, eta_min, open, delivery_radius_km, hours, status, tags, cover_url, health_score, description) VALUES
  (
    '00000000-0000-4000-8000-000000000001',
    'Krishnan Provision Store', 'Krishnan R.', 'T. Nagar',
    4.8, 0.8, 15, true, 3.0,
    '7:00 AM – 10:00 PM', 'active',
    ARRAY['kirana','organic','trusted'],
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=400&fit=crop',
    92, 'Your trusted neighborhood kirana — quality provisions since 1987.'
  ),
  (
    '00000000-0000-4000-8000-000000000002',
    'Anna Nagar Fresh Mart', 'Venkatesh S.', 'Anna Nagar',
    4.6, 1.2, 22, true, 4.0,
    '6:30 AM – 11:00 PM', 'active',
    ARRAY['fresh','daily','organic'],
    'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&h=400&fit=crop',
    87, 'Fresh daily supplies — vegetables, dairy, and pantry essentials.'
  ),
  (
    '00000000-0000-4000-8000-000000000003',
    'Adyar Supermart', 'Meenakshi D.', 'Adyar',
    4.4, 2.1, 30, true, 5.0,
    '8:00 AM – 9:30 PM', 'active',
    ARRAY['supermart','bulk','wholesale'],
    'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=800&h=400&fit=crop',
    78, 'One-stop shop for all your grocery needs at wholesale prices.'
  ),
  (
    '00000000-0000-4000-8000-000000000004',
    'Velachery Daily Needs', 'Rajan K.', 'Velachery',
    4.3, 1.5, 25, false, 3.5,
    '7:30 AM – 9:00 PM', 'active',
    ARRAY['daily','budget','essentials'],
    'https://images.unsplash.com/photo-1601599963565-b7f49a5a5fd8?w=800&h=400&fit=crop',
    71, 'Budget-friendly grocery shopping for everyday essentials.'
  )
ON CONFLICT (id) DO NOTHING;

-- ─── Products — Store 1 (Krishnan Provision Store) ────────────────────────────
INSERT INTO public.products (id, store_id, category_id, name, price, unit, image_url, description, active, trend, sold_today) VALUES
  ('10000000-0000-4000-8000-000000000101','00000000-0000-4000-8000-000000000001','staples','India Gate Basmati Rice',285,'5 kg','https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop','Premium aged basmati rice, long grain, aromatic.',true,'[10,12,14,13,15,18,20]',12),
  ('10000000-0000-4000-8000-000000000102','00000000-0000-4000-8000-000000000001','staples','Aashirvaad Whole Wheat Atta',435,'10 kg','https://images.unsplash.com/photo-1568254183919-78a4f43a2877?w=400&h=400&fit=crop','100% whole wheat, rich in fibre.',true,'[8,10,12,11,13,14,16]',8),
  ('10000000-0000-4000-8000-000000000103','00000000-0000-4000-8000-000000000001','staples','Toor Dal (Arhar)',165,'1 kg','https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=400&fit=crop','Split pigeon peas, ideal for sambar and dal.',true,'[15,14,16,18,20,22,19]',15),
  ('10000000-0000-4000-8000-000000000104','00000000-0000-4000-8000-000000000001','dairy','Amul Taaza Toned Milk',32,'500 ml','https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop','Fresh toned milk, 3% fat.',true,'[20,22,25,24,28,30,27]',25),
  ('10000000-0000-4000-8000-000000000105','00000000-0000-4000-8000-000000000001','dairy','Nandini Cow Ghee',585,'500 ml','https://images.unsplash.com/photo-1600718374662-0483d2b9da44?w=400&h=400&fit=crop','Pure cow ghee, traditionally churned.',true,'[5,6,7,8,7,9,10]',6),
  ('10000000-0000-4000-8000-000000000106','00000000-0000-4000-8000-000000000001','spices','Everest Turmeric Powder',65,'100 g','https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=400&fit=crop','Bright yellow, high curcumin content.',true,'[8,9,10,11,12,11,13]',9),
  ('10000000-0000-4000-8000-000000000107','00000000-0000-4000-8000-000000000001','beverages','Tata Tea Gold',220,'500 g','https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop','Premium blended tea for a rich brew.',true,'[12,14,13,15,17,16,18]',14),
  ('10000000-0000-4000-8000-000000000108','00000000-0000-4000-8000-000000000001','household','Vim Dishwash Bar',30,'250 g','https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400&h=400&fit=crop','Powerful grease-cutting dishwash bar.',true,'[6,7,8,7,9,10,11]',7)
ON CONFLICT (id) DO NOTHING;

-- ─── Products — Store 2 (Anna Nagar Fresh Mart) ───────────────────────────────
INSERT INTO public.products (id, store_id, category_id, name, price, unit, image_url, description, active, trend, sold_today) VALUES
  ('10000000-0000-4000-8000-000000000201','00000000-0000-4000-8000-000000000002','produce','Fresh Tomatoes',40,'1 kg','https://images.unsplash.com/photo-1546470427-e2c85f8f5b78?w=400&h=400&fit=crop','Locally sourced, ripe and juicy tomatoes.',true,'[18,20,22,25,24,28,30]',22),
  ('10000000-0000-4000-8000-000000000202','00000000-0000-4000-8000-000000000002','produce','Onions',35,'1 kg','https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=400&h=400&fit=crop','Farm-fresh red onions from Nasik.',true,'[22,25,28,30,32,35,38]',30),
  ('10000000-0000-4000-8000-000000000203','00000000-0000-4000-8000-000000000002','produce','Bananas (Robusta)',45,'12 pcs','https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop','Sweet Robusta bananas, ripe and ready.',true,'[10,12,11,13,14,15,16]',12),
  ('10000000-0000-4000-8000-000000000204','00000000-0000-4000-8000-000000000002','dairy','Aavin Full Cream Milk',40,'500 ml','https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop','Tamil Nadu co-operative full cream milk.',true,'[15,16,18,20,22,21,24]',18),
  ('10000000-0000-4000-8000-000000000205','00000000-0000-4000-8000-000000000002','dairy','Amul Paneer',95,'200 g','https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop','Fresh cottage cheese, firm texture.',true,'[8,9,10,11,12,11,13]',10),
  ('10000000-0000-4000-8000-000000000206','00000000-0000-4000-8000-000000000002','snacks','Haldirams Aloo Bhujia',55,'200 g','https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop','Crunchy potato bhujia, spiced to perfection.',true,'[12,14,16,15,18,20,22]',15),
  ('10000000-0000-4000-8000-000000000207','00000000-0000-4000-8000-000000000002','staples','Fortune Sunflower Oil',245,'1 L','https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=400&h=400&fit=crop','Light, healthy sunflower cooking oil.',true,'[10,11,12,11,13,14,15]',11),
  ('10000000-0000-4000-8000-000000000208','00000000-0000-4000-8000-000000000002','staples','Moong Dal',140,'1 kg','https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=400&fit=crop','Split green gram, quick to cook.',true,'[8,9,10,11,10,12,13]',9)
ON CONFLICT (id) DO NOTHING;

-- ─── Products — Store 3 (Adyar Supermart) ────────────────────────────────────
INSERT INTO public.products (id, store_id, category_id, name, price, unit, image_url, description, active, trend, sold_today) VALUES
  ('10000000-0000-4000-8000-000000000301','00000000-0000-4000-8000-000000000003','staples','Idhayam Sesame Oil',320,'1 L','https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=400&h=400&fit=crop','Cold-pressed gingelly oil, traditional taste.',true,'[6,7,8,9,8,10,11]',7),
  ('10000000-0000-4000-8000-000000000302','00000000-0000-4000-8000-000000000003','spices','MDH Garam Masala',95,'100 g','https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop','Aromatic blend of whole spices.',true,'[9,10,11,12,11,13,14]',10),
  ('10000000-0000-4000-8000-000000000303','00000000-0000-4000-8000-000000000003','spices','Everest Red Chilli Powder',75,'100 g','https://images.unsplash.com/photo-1583119912267-cc97c911e416?w=400&h=400&fit=crop','Fiery red chilli powder, vibrant colour.',true,'[8,9,10,11,10,12,13]',9),
  ('10000000-0000-4000-8000-000000000304','00000000-0000-4000-8000-000000000003','dairy','Eggs (White Hen)',90,'12 pcs','https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=400&h=400&fit=crop','Farm fresh white eggs, protein-rich.',true,'[20,22,24,25,28,30,32]',24),
  ('10000000-0000-4000-8000-000000000305','00000000-0000-4000-8000-000000000003','beverages','Bournvita Health Drink',290,'500 g','https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop','Chocolate malt drink with vitamins.',true,'[5,6,7,8,7,9,10]',6),
  ('10000000-0000-4000-8000-000000000306','00000000-0000-4000-8000-000000000003','personal','Dettol Soap',50,'75 g','https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=400&h=400&fit=crop','Antibacterial protection soap.',true,'[10,11,12,13,12,14,15]',11),
  ('10000000-0000-4000-8000-000000000307','00000000-0000-4000-8000-000000000003','staples','Besan (Gram Flour)',78,'1 kg','https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=400&h=400&fit=crop','Finely milled chickpea flour.',true,'[7,8,9,10,9,11,12]',8),
  ('10000000-0000-4000-8000-000000000308','00000000-0000-4000-8000-000000000003','snacks','Parle-G Biscuits',10,'100 g','https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop','Iconic glucose biscuits, loved since 1939.',true,'[30,32,35,38,40,42,45]',38)
ON CONFLICT (id) DO NOTHING;

-- ─── Products — Store 4 (Velachery Daily Needs) ───────────────────────────────
INSERT INTO public.products (id, store_id, category_id, name, price, unit, image_url, description, active, trend, sold_today) VALUES
  ('10000000-0000-4000-8000-000000000401','00000000-0000-4000-8000-000000000004','staples','Chana Dal',95,'1 kg','https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=400&fit=crop','Split bengal gram, great for curries.',true,'[8,9,10,9,11,12,13]',9),
  ('10000000-0000-4000-8000-000000000402','00000000-0000-4000-8000-000000000004','staples','Poha (Flattened Rice)',55,'500 g','https://images.unsplash.com/photo-1631452180775-72b8be51c11a?w=400&h=400&fit=crop','Thin beaten rice, quick breakfast staple.',true,'[6,7,8,9,8,10,11]',7),
  ('10000000-0000-4000-8000-000000000403','00000000-0000-4000-8000-000000000004','staples','Sugar (Double Refined)',55,'1 kg','https://images.unsplash.com/photo-1610725664285-7c57e6eeac3f?w=400&h=400&fit=crop','Fine grain double refined white sugar.',true,'[12,14,15,16,18,20,22]',14),
  ('10000000-0000-4000-8000-000000000404','00000000-0000-4000-8000-000000000004','snacks','Britannia Bread',45,'400 g','https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop','Soft sandwich bread, stays fresh longer.',true,'[15,16,18,20,19,22,24]',18),
  ('10000000-0000-4000-8000-000000000405','00000000-0000-4000-8000-000000000004','beverages','Nescafe Classic',210,'50 g','https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop','Instant coffee with rich aroma.',true,'[8,9,10,11,10,12,13]',9),
  ('10000000-0000-4000-8000-000000000406','00000000-0000-4000-8000-000000000004','household','Surf Excel Easy Wash',130,'500 g','https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400&h=400&fit=crop','Detergent powder, tough on stains.',true,'[7,8,9,10,9,11,12]',8),
  ('10000000-0000-4000-8000-000000000407','00000000-0000-4000-8000-000000000004','personal','Colgate Strong Teeth',55,'200 g','https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=400&h=400&fit=crop','Cavity protection toothpaste.',true,'[10,11,12,13,12,14,15]',11),
  ('10000000-0000-4000-8000-000000000408','00000000-0000-4000-8000-000000000004','dairy','Amul Butter',58,'100 g','https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop','Salted butter, creamy and fresh.',true,'[8,9,10,11,10,12,13]',9)
ON CONFLICT (id) DO NOTHING;

-- ─── Inventory (stock + threshold for every product) ──────────────────────────

-- Store 1 inventory
INSERT INTO public.inventory (product_id, stock, threshold) VALUES
  ('10000000-0000-4000-8000-000000000101', 45, 10),
  ('10000000-0000-4000-8000-000000000102', 30, 8),
  ('10000000-0000-4000-8000-000000000103', 60, 15),
  ('10000000-0000-4000-8000-000000000104', 80, 20),
  ('10000000-0000-4000-8000-000000000105', 18, 5),
  ('10000000-0000-4000-8000-000000000106', 40, 10),
  ('10000000-0000-4000-8000-000000000107', 35, 10),
  ('10000000-0000-4000-8000-000000000108', 50, 15)
ON CONFLICT (product_id) DO NOTHING;

-- Store 2 inventory
INSERT INTO public.inventory (product_id, stock, threshold) VALUES
  ('10000000-0000-4000-8000-000000000201', 120, 30),
  ('10000000-0000-4000-8000-000000000202', 150, 40),
  ('10000000-0000-4000-8000-000000000203', 80, 20),
  ('10000000-0000-4000-8000-000000000204', 100, 25),
  ('10000000-0000-4000-8000-000000000205', 25, 8),
  ('10000000-0000-4000-8000-000000000206', 60, 15),
  ('10000000-0000-4000-8000-000000000207', 40, 10),
  ('10000000-0000-4000-8000-000000000208', 55, 15)
ON CONFLICT (product_id) DO NOTHING;

-- Store 3 inventory
INSERT INTO public.inventory (product_id, stock, threshold) VALUES
  ('10000000-0000-4000-8000-000000000301', 22, 6),
  ('10000000-0000-4000-8000-000000000302', 45, 12),
  ('10000000-0000-4000-8000-000000000303', 38, 10),
  ('10000000-0000-4000-8000-000000000304', 200, 50),
  ('10000000-0000-4000-8000-000000000305', 20, 5),
  ('10000000-0000-4000-8000-000000000306', 70, 20),
  ('10000000-0000-4000-8000-000000000307', 35, 10),
  ('10000000-0000-4000-8000-000000000308', 150, 40)
ON CONFLICT (product_id) DO NOTHING;

-- Store 4 inventory
INSERT INTO public.inventory (product_id, stock, threshold) VALUES
  ('10000000-0000-4000-8000-000000000401', 40, 10),
  ('10000000-0000-4000-8000-000000000402', 30, 8),
  ('10000000-0000-4000-8000-000000000403', 90, 25),
  ('10000000-0000-4000-8000-000000000404', 0, 10),
  ('10000000-0000-4000-8000-000000000405', 25, 8),
  ('10000000-0000-4000-8000-000000000406', 45, 12),
  ('10000000-0000-4000-8000-000000000407', 60, 15),
  ('10000000-0000-4000-8000-000000000408', 35, 10)
ON CONFLICT (product_id) DO NOTHING;
