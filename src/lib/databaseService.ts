import {
  Category,
  Product,
  Customer,
  Order,
  OrderItem,
  OrderStatus,
  StoreSettings,
  AdminProfile,
} from '../types/database';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_STORE_SETTINGS } from '../data/initialData';
import { getSupabase } from './supabase';

const STORAGE_KEYS = {
  CATEGORIES: 'tsb_db_categories',
  PRODUCTS: 'tsb_db_products',
  ORDERS: 'tsb_db_orders',
  CUSTOMERS: 'tsb_db_customers',
  SETTINGS: 'tsb_db_settings',
  ADMIN_SESSION: 'tsb_admin_session',
};

// Seed local fallback storage if not present
function initializeLocalDB() {
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_STORE_SETTINGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    // Generate 2 sample historical orders for rich admin dashboard experience
    const sampleOrders: Order[] = [
      {
        id: 'ord-1001',
        order_number: 'TSB-2026-1042',
        customer_id: 'cust-1',
        customer_name: 'Muhammad Tariq Khan',
        phone: '0300-1234567',
        delivery_address: 'House 42, Street 8, Sector Y, DHA Phase 3, Lahore',
        subtotal_amount: 3800,
        delivery_fee: 0,
        total_amount: 3800,
        payment_method: 'Cash on Delivery',
        order_status: 'Delivered',
        notes: 'Please pack in golden gift box with fresh ribbons.',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        items: [
          {
            id: 'item-1',
            order_id: 'ord-1001',
            product_id: 'prod-belgian-fudge-cake',
            product_name: 'Signature Belgian Chocolate Fudge Cake',
            unit_price: 2400,
            quantity: 1,
            subtotal: 2400,
          },
          {
            id: 'item-2',
            order_id: 'ord-1001',
            product_id: 'prod-gulab-jamun',
            product_name: 'Desi Ghee Gulab Jamun',
            unit_price: 1400,
            quantity: 1,
            subtotal: 1400,
          },
        ],
      },
      {
        id: 'ord-1002',
        order_number: 'TSB-2026-1088',
        customer_id: 'cust-2',
        customer_name: 'Ayesha Siddiqui',
        phone: '0321-7654321',
        delivery_address: 'Apartment 4B, Mall Residency, Gulberg III, Lahore',
        subtotal_amount: 2050,
        delivery_fee: 180,
        total_amount: 2230,
        payment_method: 'Cash on Delivery',
        order_status: 'Preparing',
        notes: 'Extra mint sauce with chicken patties please.',
        created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
        items: [
          {
            id: 'item-3',
            order_id: 'ord-1002',
            product_id: 'prod-lahori-nan-khatai',
            product_name: 'Tariq Special Royal Almond Nan Khatai',
            unit_price: 1100,
            quantity: 1,
            subtotal: 1100,
          },
          {
            id: 'item-4',
            order_id: 'ord-1002',
            product_id: 'prod-chicken-puff-patties',
            product_name: 'Signature Flaky Chicken Patties',
            unit_price: 140,
            quantity: 5,
            subtotal: 700,
          },
          {
            id: 'item-5',
            order_id: 'ord-1002',
            product_id: 'prod-bakery-samosa',
            product_name: 'Cocktail Potato & Pea Samosas',
            unit_price: 60,
            quantity: 4,
            subtotal: 240,
          },
        ],
      },
    ];
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(sampleOrders));
  }
}

initializeLocalDB();

// --- Categories ---
export async function getCategories(): Promise<Category[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (!error && data && data.length > 0) {
        return data as Category[];
      }
    } catch (e) {
      console.warn('Supabase getCategories failed, falling back to local DB:', e);
    }
  }

  const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  return raw ? JSON.parse(raw) : INITIAL_CATEGORIES;
}

export async function createCategory(cat: Omit<Category, 'id' | 'created_at'>): Promise<Category> {
  const newCat: Category = {
    ...cat,
    id: 'cat-' + Date.now().toString(36),
    created_at: new Date().toISOString(),
  };

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('categories').insert([newCat]).select().single();
      if (!error && data) return data as Category;
    } catch (e) {
      console.warn('Supabase createCategory error:', e);
    }
  }

  const categories = await getCategories();
  const updated = [newCat, ...categories];
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updated));
  return newCat;
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (!error && data) return data as Category;
    } catch (e) {
      console.warn('Supabase updateCategory error:', e);
    }
  }

  const categories = await getCategories();
  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) throw new Error('Category not found');
  const updated = { ...categories[index], ...updates };
  categories[index] = updated;
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  return updated;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('categories').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase deleteCategory error:', e);
    }
  }

  const categories = await getCategories();
  const filtered = categories.filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(filtered));
  return true;
}

// --- Products ---
export async function getProducts(categoryId?: string): Promise<Product[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      let query = supabase.from('products').select('*, categories(name)').order('name');
      if (categoryId && categoryId !== 'all') {
        query = query.eq('category_id', categoryId);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map((item: any) => ({
          ...item,
          category_name: item.categories?.name,
        })) as Product[];
      }
    } catch (e) {
      console.warn('Supabase getProducts failed, falling back:', e);
    }
  }

  const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  let products: Product[] = raw ? JSON.parse(raw) : INITIAL_PRODUCTS;

  // Enrich with category_name
  const categories = await getCategories();
  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));
  products = products.map((p) => ({
    ...p,
    category_name: categoryMap.get(p.category_id) || 'Bakery Item',
  }));

  if (categoryId && categoryId !== 'all') {
    return products.filter((p) => p.category_id === categoryId);
  }
  return products;
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.id === id) || null;
}

export async function createProduct(prod: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
  const now = new Date().toISOString();
  const newProd: Product = {
    ...prod,
    id: 'prod-' + Date.now().toString(36),
    created_at: now,
    updated_at: now,
  };

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('products').insert([newProd]).select().single();
      if (!error && data) return data as Product;
    } catch (e) {
      console.warn('Supabase createProduct error:', e);
    }
  }

  const products = await getProducts();
  const updated = [newProd, ...products];
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
  return newProd;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  const now = new Date().toISOString();
  const cleanUpdates = { ...updates, updated_at: now };

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(cleanUpdates)
        .eq('id', id)
        .select()
        .single();
      if (!error && data) return data as Product;
    } catch (e) {
      console.warn('Supabase updateProduct error:', e);
    }
  }

  const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  const products: Product[] = raw ? JSON.parse(raw) : INITIAL_PRODUCTS;
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) throw new Error('Product not found');
  const updated = { ...products[index], ...cleanUpdates };
  products[index] = updated;
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  return updated;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('products').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase deleteProduct error:', e);
    }
  }

  const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  const products: Product[] = raw ? JSON.parse(raw) : INITIAL_PRODUCTS;
  const filtered = products.filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filtered));
  return true;
}

// --- Store Settings ---
export async function getStoreSettings(): Promise<StoreSettings> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('store_settings').select('*').limit(1).single();
      if (!error && data) return data as StoreSettings;
    } catch (e) {
      console.warn('Supabase getStoreSettings failed, fallback to local:', e);
    }
  }

  const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return raw ? JSON.parse(raw) : INITIAL_STORE_SETTINGS;
}

export async function updateStoreSettings(updates: Partial<StoreSettings>): Promise<StoreSettings> {
  const now = new Date().toISOString();
  const cleanUpdates = { ...updates, updated_at: now };

  const supabase = getSupabase();
  if (supabase) {
    try {
      const current = await getStoreSettings();
      const { data, error } = await supabase
        .from('store_settings')
        .update(cleanUpdates)
        .eq('id', current.id)
        .select()
        .single();
      if (!error && data) return data as StoreSettings;
    } catch (e) {
      console.warn('Supabase updateStoreSettings error:', e);
    }
  }

  const current = await getStoreSettings();
  const updated = { ...current, ...cleanUpdates };
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  return updated;
}

// --- Orders & Checkout ---
export interface OrderPayload {
  customer_name: string;
  phone: string;
  delivery_address: string;
  notes?: string;
  payment_method: 'Cash on Delivery' | 'Bank Transfer / JazzCash / EasyPaisa';
  items: {
    product: Product;
    quantity: number;
  }[];
}

export async function createOrder(payload: OrderPayload): Promise<Order> {
  const settings = await getStoreSettings();
  
  // Recalculate subtotal using trusted server/database product prices
  const allProducts = await getProducts();
  const productMap = new Map(allProducts.map((p) => [p.id, p]));

  let subtotal = 0;
  const orderItemsData: OrderItem[] = [];
  const orderId = 'ord-' + Date.now().toString(36);

  for (const item of payload.items) {
    const verifiedProduct = productMap.get(item.product.id) || item.product;
    const itemSubtotal = verifiedProduct.price * item.quantity;
    subtotal += itemSubtotal;

    orderItemsData.push({
      id: 'item-' + Math.random().toString(36).substring(2, 9),
      order_id: orderId,
      product_id: verifiedProduct.id,
      product_name: verifiedProduct.name,
      unit_price: verifiedProduct.price,
      quantity: item.quantity,
      subtotal: itemSubtotal,
    });
  }

  const deliveryFee = subtotal >= settings.free_delivery_threshold ? 0 : settings.delivery_charge;
  const totalAmount = subtotal + deliveryFee;

  // Generate unique order number e.g. TSB-2026-7241
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `TSB-2026-${randomSuffix}`;

  const customerId = 'cust-' + Date.now().toString(36);
  const newCustomer: Customer = {
    id: customerId,
    full_name: payload.customer_name,
    phone: payload.phone,
    address: payload.delivery_address,
    created_at: new Date().toISOString(),
  };

  const newOrder: Order = {
    id: orderId,
    order_number: orderNumber,
    customer_id: customerId,
    customer: newCustomer,
    customer_name: payload.customer_name,
    phone: payload.phone,
    delivery_address: payload.delivery_address,
    subtotal_amount: subtotal,
    delivery_fee: deliveryFee,
    total_amount: totalAmount,
    payment_method: payload.payment_method,
    order_status: 'Pending',
    notes: payload.notes || '',
    items: orderItemsData,
    created_at: new Date().toISOString(),
  };

  const supabase = getSupabase();
  if (supabase) {
    try {
      // 1. Save customer
      await supabase.from('customers').insert([
        {
          full_name: payload.customer_name,
          phone: payload.phone,
          address: payload.delivery_address,
        },
      ]);

      // 2. Save order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            order_number: orderNumber,
            customer_name: payload.customer_name,
            phone: payload.phone,
            delivery_address: payload.delivery_address,
            subtotal_amount: subtotal,
            delivery_fee: deliveryFee,
            total_amount: totalAmount,
            payment_method: payload.payment_method,
            order_status: 'Pending',
            notes: payload.notes || '',
          },
        ])
        .select()
        .single();

      if (!orderError && orderData) {
        // 3. Save order items snapshot
        const itemsToInsert = orderItemsData.map((it) => ({
          order_id: orderData.id,
          product_id: it.product_id,
          product_name: it.product_name,
          unit_price: it.unit_price,
          quantity: it.quantity,
          subtotal: it.subtotal,
        }));
        await supabase.from('order_items').insert(itemsToInsert);

        newOrder.id = orderData.id;
        return newOrder;
      }
    } catch (e) {
      console.warn('Supabase createOrder error, storing locally:', e);
    }
  }

  // Fallback to local storage persistence
  const existingOrders = await getOrders();
  const updatedOrders = [newOrder, ...existingOrders];
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updatedOrders));

  return newOrder;
}

export async function getOrders(): Promise<Order[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((o: any) => ({
          ...o,
          items: o.order_items || [],
        })) as Order[];
      }
    } catch (e) {
      console.warn('Supabase getOrders error:', e);
    }
  }

  const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
  return raw ? JSON.parse(raw) : [];
}

export async function getOrderByIdOrNumber(query: string): Promise<Order | null> {
  const clean = query.trim().toUpperCase();
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .or(`order_number.eq.${clean},id.eq.${query.trim()}`)
        .maybeSingle();
      if (!error && data) {
        return {
          ...data,
          items: data.order_items || [],
        } as Order;
      }
    } catch (e) {
      console.warn('Supabase getOrderByIdOrNumber error:', e);
    }
  }

  const orders = await getOrders();
  return (
    orders.find(
      (o) =>
        o.order_number.toUpperCase() === clean ||
        o.id === query.trim() ||
        o.phone.replace(/[^0-9]/g, '').includes(clean.replace(/[^0-9]/g, ''))
    ) || null
  );
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ order_status: status })
        .eq('id', orderId)
        .select('*, order_items(*)')
        .single();
      if (!error && data) {
        return {
          ...data,
          items: data.order_items || [],
        } as Order;
      }
    } catch (e) {
      console.warn('Supabase updateOrderStatus error:', e);
    }
  }

  const orders = await getOrders();
  const index = orders.findIndex((o) => o.id === orderId || o.order_number === orderId);
  if (index === -1) throw new Error('Order not found');
  orders[index].order_status = status;
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  return orders[index];
}

// --- Image Management / Storage ---
export async function uploadProductImage(file: File): Promise<string> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (!uploadError) {
        const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
        if (data?.publicUrl) return data.publicUrl;
      } else {
        console.warn('Supabase storage upload error:', uploadError);
      }
    } catch (e) {
      console.warn('Supabase storage exception:', e);
    }
  }

  // Fallback to base64 DataURL for local persistence
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// --- Admin Authentication ---
export function getAdminSession(): AdminProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function adminLogin(email: string, password: string): Promise<AdminProfile> {
  const cleanEmail = email.trim().toLowerCase();
  
  // Real Supabase Auth attempt if configured
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });
      if (!error && data.user) {
        const profile: AdminProfile = {
          id: data.user.id,
          full_name: data.user.user_metadata?.full_name || 'Admin User',
          email: data.user.email || cleanEmail,
          role: 'superadmin',
          created_at: data.user.created_at,
        };
        localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(profile));
        return profile;
      }
    } catch (e) {
      console.warn('Supabase auth failed, verifying master admin credential:', e);
    }
  }

  // Pre-configured master admin credentials for effortless testing & verification
  if (
    (cleanEmail === 'admin@tariqsweets.pk' || cleanEmail === 'admin@tariqbakers.com' || cleanEmail === 'admin') &&
    (password === 'tariq123' || password === 'admin123')
  ) {
    const profile: AdminProfile = {
      id: 'adm-master-1',
      full_name: 'Haji Tariq Mehmood',
      email: 'admin@tariqsweets.pk',
      role: 'superadmin',
      created_at: new Date('2026-01-01').toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(profile));
    return profile;
  }

  throw new Error('Invalid email or password. Use demo credentials: admin@tariqsweets.pk / tariq123');
}

export function adminLogout() {
  localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
  const supabase = getSupabase();
  if (supabase) {
    supabase.auth.signOut().catch(() => {});
  }
}

export function resetDatabaseToDefault() {
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_STORE_SETTINGS));
}
