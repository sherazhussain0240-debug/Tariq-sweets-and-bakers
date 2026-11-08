export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  is_active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  category_name?: string;
  name: string;
  description: string;
  price: number;
  unit: string; // e.g. "per kg", "per piece", "per 2 lbs box"
  image_url: string;
  is_available: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  full_name: string;
  phone: string;
  address: string;
  created_at: string;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Preparing'
  | 'Ready'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod = 'Cash on Delivery' | 'Bank Transfer / JazzCash / EasyPaisa';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  customer?: Customer;
  total_amount: number;
  subtotal_amount: number;
  delivery_fee: number;
  delivery_address: string;
  phone: string;
  customer_name: string;
  payment_method: PaymentMethod;
  order_status: OrderStatus;
  notes?: string;
  items?: OrderItem[];
  created_at: string;
}

export interface AdminProfile {
  id: string;
  full_name: string;
  role: 'superadmin' | 'admin' | 'manager';
  email: string;
  created_at: string;
}

export interface StoreSettings {
  id: string;
  store_name: string;
  logo_url: string;
  phone: string;
  address: string;
  delivery_charge: number;
  free_delivery_threshold: number;
  opening_hours: string;
  promo_banner_text: string;
  promo_banner_active: boolean;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
