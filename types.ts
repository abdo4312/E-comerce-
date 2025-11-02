export interface Subcategory {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  author: string; // Will be used as brand/maker for non-book items
  price: number;
  discountPrice?: number; // Optional discount price
  stock: number;
  imageUrl: string;
  category: string;
  subcategory: string;
  description?: string;
  status: 'متوفر' | 'غير متوفر';
  dateAdded: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export type OrderStatusType = 'pending' | 'ready' | 'completed' | 'cancelled';

export interface Order {
    id: string;
    items: CartItem[];
    total: number;
    status: OrderStatusType;
    pickupTime: Date;
    user: User;
    phone: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description?: string;
  imageUrl?: string;
  subcategories?: Subcategory[];
}