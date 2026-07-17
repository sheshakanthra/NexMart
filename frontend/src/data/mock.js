// Mock data for NexMart - Indian hyperlocal kirana context
// Chennai neighborhoods, realistic INR prices, Indian grocery items

export const NEIGHBORHOODS = [
  'T. Nagar', 'Adyar', 'Anna Nagar', 'Velachery', 'Besant Nagar',
  'Mylapore', 'Nungambakkam', 'Kilpauk', 'Egmore', 'Perambur',
  'Tambaram', 'Porur', 'Guindy', 'Alwarpet',
];

export const CATEGORIES = [
  { id: 'staples', name: 'Staples & Grains', icon: 'Wheat' },
  { id: 'dairy', name: 'Dairy & Eggs', icon: 'Milk' },
  { id: 'produce', name: 'Fruits & Vegetables', icon: 'Apple' },
  { id: 'spices', name: 'Spices & Masalas', icon: 'Flame' },
  { id: 'snacks', name: 'Snacks & Namkeen', icon: 'Cookie' },
  { id: 'beverages', name: 'Beverages', icon: 'CupSoda' },
  { id: 'personal', name: 'Personal Care', icon: 'Sparkles' },
  { id: 'household', name: 'Household', icon: 'Home' },
];

const IMG = {
  rice: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
  atta: 'https://images.unsplash.com/photo-1568254183919-78a4f43a2877?w=400&h=400&fit=crop',
  dal:  'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=400&fit=crop',
  oil:  'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=400&h=400&fit=crop',
  milk: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop',
  paneer: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop',
  tomato: 'https://images.unsplash.com/photo-1546470427-e2c85f8f5b78?w=400&h=400&fit=crop',
  onion: 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=400&h=400&fit=crop',
  banana: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop',
  chili: 'https://images.unsplash.com/photo-1583119912267-cc97c911e416?w=400&h=400&fit=crop',
  turmeric: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=400&fit=crop',
  garam: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop',
  biscuit: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop',
  chai: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop',
  soap: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=400&h=400&fit=crop',
  detergent: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400&h=400&fit=crop',
  ghee: 'https://images.unsplash.com/photo-1600718374662-0483d2b9da44?w=400&h=400&fit=crop',
  sugar: 'https://images.unsplash.com/photo-1610725664285-7c57e6eeac3f?w=400&h=400&fit=crop',
  bread: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop',
  egg: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=400&h=400&fit=crop',
  poha: 'https://images.unsplash.com/photo-1631452180775-72b8be51c11a?w=400&h=400&fit=crop',
  besan: 'https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=400&h=400&fit=crop',
};

// Product catalog templates
export const PRODUCT_CATALOG = [
  { name: 'India Gate Basmati Rice',   category: 'staples', price: 285, unit: '5 kg', img: IMG.rice },
  { name: 'Aashirvaad Whole Wheat Atta', category: 'staples', price: 435, unit: '10 kg', img: IMG.atta },
  { name: 'Toor Dal (Arhar)',          category: 'staples', price: 165, unit: '1 kg', img: IMG.dal },
  { name: 'Moong Dal',                 category: 'staples', price: 140, unit: '1 kg', img: IMG.dal },
  { name: 'Chana Dal',                 category: 'staples', price: 95,  unit: '1 kg', img: IMG.dal },
  { name: 'Besan (Gram Flour)',        category: 'staples', price: 78,  unit: '1 kg', img: IMG.besan },
  { name: 'Poha (Flattened Rice)',     category: 'staples', price: 55,  unit: '500 g', img: IMG.poha },
  { name: 'Fortune Sunflower Oil',     category: 'staples', price: 245, unit: '1 L', img: IMG.oil },
  { name: 'Idhayam Sesame Oil',        category: 'staples', price: 320, unit: '1 L', img: IMG.oil },
  { name: 'Amul Taaza Toned Milk',     category: 'dairy',   price: 32,  unit: '500 ml', img: IMG.milk },
  { name: 'Aavin Full Cream Milk',     category: 'dairy',   price: 40,  unit: '500 ml', img: IMG.milk },
  { name: 'Amul Paneer',               category: 'dairy',   price: 95,  unit: '200 g', img: IMG.paneer },
  { name: 'Nandini Cow Ghee',          category: 'dairy',   price: 585, unit: '500 ml', img: IMG.ghee },
  { name: 'Country Eggs (Nattu Kozhi)',category: 'dairy',   price: 90,  unit: '6 pcs', img: IMG.egg },
  { name: 'Modern Milk Bread',         category: 'dairy',   price: 45,  unit: '400 g', img: IMG.bread },
  { name: 'Tomatoes (Local)',          category: 'produce', price: 45,  unit: '1 kg', img: IMG.tomato },
  { name: 'Onions (Nashik)',           category: 'produce', price: 38,  unit: '1 kg', img: IMG.onion },
  { name: 'Robusta Bananas',           category: 'produce', price: 62,  unit: '1 dozen', img: IMG.banana },
  { name: 'Green Chillies',            category: 'produce', price: 22,  unit: '250 g', img: IMG.chili },
  { name: 'Ginger',                    category: 'produce', price: 35,  unit: '250 g', img: IMG.chili },
  { name: 'MDH Turmeric Powder',       category: 'spices',  price: 68,  unit: '200 g', img: IMG.turmeric },
  { name: 'Everest Garam Masala',      category: 'spices',  price: 92,  unit: '100 g', img: IMG.garam },
  { name: 'Aachi Sambar Powder',       category: 'spices',  price: 78,  unit: '200 g', img: IMG.garam },
  { name: 'Sakthi Chicken Masala',     category: 'spices',  price: 95,  unit: '200 g', img: IMG.garam },
  { name: 'Parle-G Biscuits',          category: 'snacks',  price: 25,  unit: '250 g', img: IMG.biscuit },
  { name: 'Britannia Good Day',        category: 'snacks',  price: 45,  unit: '200 g', img: IMG.biscuit },
  { name: 'Haldiram Aloo Bhujia',      category: 'snacks',  price: 65,  unit: '200 g', img: IMG.biscuit },
  { name: 'Red Label Tea',             category: 'beverages', price: 155, unit: '500 g', img: IMG.chai },
  { name: 'Bru Instant Coffee',        category: 'beverages', price: 210, unit: '100 g', img: IMG.chai },
  { name: 'Bournvita',                 category: 'beverages', price: 245, unit: '500 g', img: IMG.chai },
  { name: 'Madhur Sugar',              category: 'staples', price: 48,  unit: '1 kg', img: IMG.sugar },
  { name: 'Tata Salt',                 category: 'staples', price: 28,  unit: '1 kg', img: IMG.sugar },
  { name: 'Mysore Sandal Soap',        category: 'personal', price: 55, unit: '125 g', img: IMG.soap },
  { name: 'Colgate Toothpaste',        category: 'personal', price: 92, unit: '150 g', img: IMG.soap },
  { name: 'Surf Excel Detergent',      category: 'household', price: 285, unit: '2 kg', img: IMG.detergent },
  { name: 'Vim Dishwash Bar',          category: 'household', price: 25,  unit: '2 pcs', img: IMG.detergent },
];

const STORE_NAMES = [
  { name: 'Krishna Kirana Stores', owner: 'Krishnan R.' },
  { name: 'Sri Lakshmi Provision', owner: 'Lakshmi Priya' },
  { name: 'Anand Bhavan Mart', owner: 'Anand S.' },
  { name: 'Ramya Fresh & Daily', owner: 'Ramya Devi' },
  { name: 'Chennai Corner Store', owner: 'Ravi Kumar' },
  { name: 'Amma Supermart', owner: 'Meena Rajan' },
  { name: 'Nithya Bazaar', owner: 'Suresh Iyer' },
  { name: 'Ganesh Groceries', owner: 'Ganesh M.' },
  { name: 'Vijay Daily Needs', owner: 'Vijay Chandran' },
  { name: 'Prema Fresh Mart', owner: 'Prema V.' },
  { name: 'Saravana Stores Mini', owner: 'Saravanan K.' },
  { name: 'Kumaran Kirana', owner: 'Kumaran P.' },
];

function seededRand(seed) {
  let x = seed;
  return () => {
    x = (x * 9301 + 49297) % 233280;
    return x / 233280;
  };
}

function sparkline(seed) {
  const r = seededRand(seed);
  const arr = [];
  let v = 50 + r() * 40;
  for (let i = 0; i < 7; i++) {
    v = Math.max(10, v + (r() - 0.5) * 30);
    arr.push(Math.round(v));
  }
  return arr;
}

export function buildStores() {
  const stores = STORE_NAMES.map((s, i) => {
    const r = seededRand(i + 7);
    const products = PRODUCT_CATALOG.map((p, j) => {
      const baseStock = Math.floor(r() * 60);
      return {
        id: `p_${i}_${j}`,
        storeId: `s_${i}`,
        name: p.name,
        category: p.category,
        price: Math.round(p.price * (0.9 + r() * 0.25)),
        unit: p.unit,
        img: p.img,
        stock: baseStock,
        threshold: 5,
        active: true,
        description: `${p.name} — freshly stocked from ${STORE_NAMES[i].name}. Quality assured, packed for freshness.`,
        trend: sparkline(i * 100 + j),
        soldToday: Math.floor(r() * 25),
      };
    });
    return {
      id: `s_${i}`,
      name: s.name,
      owner: s.owner,
      neighborhood: NEIGHBORHOODS[i % NEIGHBORHOODS.length],
      rating: Math.round((3.8 + r() * 1.1) * 10) / 10,
      distanceKm: Math.round((0.3 + r() * 3.5) * 10) / 10,
      etaMin: 12 + Math.floor(r() * 25),
      open: r() > 0.15,
      deliveryRadiusKm: 2 + Math.floor(r() * 4),
      hours: '7:00 AM – 10:00 PM',
      status: i < 10 ? 'active' : (i === 10 ? 'pending' : 'pending'),
      tags: ['Groceries', 'Daily Essentials', i % 2 ? 'Dairy' : 'Fresh Produce'],
      cover: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&h=400&fit=crop',
      products,
      healthScore: Math.round(60 + r() * 40),
    };
  });
  return stores;
}

// Order status stages
export const ORDER_STAGES = ['placed', 'accepted', 'packed', 'out_for_delivery', 'delivered'];
export const ORDER_STAGE_LABELS = {
  placed: 'Placed',
  accepted: 'Accepted',
  packed: 'Packed',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const CUSTOMERS = [
  'Arjun R.', 'Divya S.', 'Karthik M.', 'Priya V.', 'Rahul K.', 'Sneha B.',
  'Vikram T.', 'Anjali P.', 'Suresh N.', 'Deepa L.', 'Manoj G.', 'Kavya R.',
  'Naveen S.', 'Preethi K.', 'Bala M.', 'Shruti V.',
];

export function buildOrders(stores) {
  const orders = [];
  const now = Date.now();
  const r = seededRand(42);
  for (let i = 0; i < 40; i++) {
    const store = stores[Math.floor(r() * stores.length)];
    if (!store) continue;
    const items = [];
    const itemCount = 2 + Math.floor(r() * 5);
    let subtotal = 0;
    for (let j = 0; j < itemCount; j++) {
      const p = store.products[Math.floor(r() * store.products.length)];
      const qty = 1 + Math.floor(r() * 3);
      subtotal += p.price * qty;
      items.push({ productId: p.id, name: p.name, price: p.price, qty, unit: p.unit, img: p.img });
    }
    const stage = i < 6 ? 'placed' : i < 12 ? 'accepted' : i < 18 ? 'packed' : i < 24 ? 'out_for_delivery' : 'delivered';
    const placedAt = now - Math.floor(r() * 24 * 3600 * 1000);
    orders.push({
      id: `NM${(90000 + i).toString()}`,
      storeId: store.id,
      storeName: store.name,
      neighborhood: store.neighborhood,
      customer: CUSTOMERS[Math.floor(r() * CUSTOMERS.length)],
      customerAddress: `${Math.floor(r() * 90 + 10)}, ${store.neighborhood}, Chennai`,
      items,
      subtotal,
      deliveryFee: 25,
      total: subtotal + 25,
      status: stage,
      placedAt,
      timeline: buildTimeline(stage, placedAt),
      payment: r() > 0.5 ? 'UPI' : 'COD',
    });
  }
  return orders.sort((a, b) => b.placedAt - a.placedAt);
}

function buildTimeline(stage, placedAt) {
  const idx = ORDER_STAGES.indexOf(stage);
  const steps = ORDER_STAGES.map((s, i) => ({
    key: s,
    label: ORDER_STAGE_LABELS[s],
    at: i <= idx ? placedAt + i * 8 * 60 * 1000 : null,
    done: i <= idx,
    active: i === idx && stage !== 'delivered',
  }));
  return steps;
}

// Chart data generators
export function hourlySales(seed = 1, evenPeaks = true) {
  const r = seededRand(seed);
  return Array.from({ length: 24 }, (_, h) => {
    let base = 8 + r() * 12;
    if (evenPeaks && (h >= 8 && h <= 11)) base += 20 + r() * 15;
    if (evenPeaks && (h >= 18 && h <= 21)) base += 35 + r() * 25;
    if (h >= 0 && h <= 5) base *= 0.15;
    return { hour: h, today: Math.round(base * 60), yesterday: Math.round(base * 55 * (0.8 + r() * 0.4)) };
  });
}

export function revenueTrend(days = 14, seed = 5, scale = 1) {
  const r = seededRand(seed);
  const arr = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now); d.setDate(d.getDate() - i);
    const isWeekend = [0, 6].includes(d.getDay());
    const base = (isWeekend ? 45000 : 32000) * scale + r() * 15000 * scale;
    arr.push({
      day: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      revenue: Math.round(base),
      orders: Math.round(base / 420),
    });
  }
  return arr;
}

export function peakGrid(seed = 3) {
  const r = seededRand(seed);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const grid = [];
  for (let d = 0; d < 7; d++) {
    for (let h = 0; h < 24; h++) {
      let intensity = r() * 30;
      if (h >= 8 && h <= 11) intensity += 40 + r() * 30;
      if (h >= 18 && h <= 21) intensity += 60 + r() * 30;
      if (d >= 5) intensity *= 1.25; // weekend
      if (h >= 0 && h <= 5) intensity *= 0.1;
      grid.push({ day: days[d], dayIdx: d, hour: h, value: Math.round(intensity) });
    }
  }
  return grid;
}

export function categoryPerf(seed = 9) {
  const r = seededRand(seed);
  return CATEGORIES.map((c) => ({
    name: c.name.split(' ')[0],
    id: c.id,
    revenue: Math.round(15000 + r() * 60000),
    orders: Math.round(40 + r() * 200),
  })).sort((a, b) => b.revenue - a.revenue);
}

export function demandForecast(productName, seed = 11) {
  const r = seededRand(seed);
  const arr = [];
  const baseSold = 8 + r() * 15;
  for (let i = 1; i <= 7; i++) {
    const pred = baseSold * (1 + (r() - 0.4) * 0.3);
    arr.push({
      day: `D+${i}`,
      forecast: Math.round(pred),
      low: Math.round(pred * 0.8),
      high: Math.round(pred * 1.2),
    });
  }
  return arr;
}

export function customerGrowth(seed = 15) {
  const r = seededRand(seed);
  const arr = [];
  let cum = 1200;
  for (let i = 29; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    cum += Math.round(40 + r() * 80);
    arr.push({ day: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }), signups: cum });
  }
  return arr;
}

export function funnelData() {
  return [
    { stage: 'Placed', value: 4820 },
    { stage: 'Accepted', value: 4610 },
    { stage: 'Packed', value: 4480 },
    { stage: 'Out for Delivery', value: 4390 },
    { stage: 'Delivered', value: 4310 },
  ];
}

export function neighborhoodTrends() {
  return NEIGHBORHOODS.map((n, i) => {
    const r = seededRand(i + 20);
    return {
      neighborhood: n,
      orders: Math.round(180 + r() * 420),
      revenue: Math.round(85000 + r() * 240000),
      growth: Math.round((r() * 40) - 8),
      topCategory: CATEGORIES[Math.floor(r() * CATEGORIES.length)].name,
    };
  }).sort((a, b) => b.orders - a.orders);
}

// Sentinel AI suggestions
export function sentinelSuggestions(storeProducts) {
  const picks = storeProducts.slice(0, 5);
  return picks.map((p, i) => ({
    id: `sug_${i}`,
    productId: p.id,
    productName: p.name,
    currentStock: p.stock,
    suggestedQty: 20 + Math.floor(Math.random() * 40),
    reason: [
      `Sales up 34% this week — projected stock-out in 2 days.`,
      `Weekend demand spike expected in ${NEIGHBORHOODS[i % NEIGHBORHOODS.length]}.`,
      `Category '${p.category}' trending +18% in your neighborhood.`,
      `Competitor stores in your radius are out — capture demand.`,
      `Festival pattern detected — usually sells 2.3x normal volume.`,
    ][i % 5],
  }));
}

export const SENTINEL_BRIEF = [
  {
    id: 'op1',
    type: 'opportunity',
    title: 'Weekend rush incoming',
    body: 'Order volume is projected +42% this Saturday. Stocking Basmati Rice and Toor Dal now could unlock ~₹18,400 in additional weekend revenue.',
    metric: '+₹18,400',
  },
  {
    id: 'rk1',
    type: 'risk',
    title: 'Stock-out risk on 3 items',
    body: 'At current velocity, Amul Paneer, Nandini Ghee, and Poha will run out before Sunday. Missed sales estimate: ₹6,200.',
    metric: '-₹6,200',
  },
  {
    id: 'ac1',
    type: 'action',
    title: 'Adjust delivery radius',
    body: 'Extending radius from 2.5km to 3.2km captures Adyar demand zone. 27 unfulfilled search queries this week originated from that area.',
    metric: '+27 orders/wk',
  },
];
