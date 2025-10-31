"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { Database } from '@/lib/database.types';

type CartItem = Database['public']['Tables']['cart_items']['Row'] & {
  product: Database['public']['Tables']['products']['Row'];
};

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  loading: boolean;
  addToCart: (productId: string, size: string, color: string, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) {
      setCartItems([]);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(*)
      `)
      .eq('user_id', user.id);

    if (!error && data) {
      setCartItems(data as CartItem[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId: string, size: string, color: string, quantity: number = 1) => {
    if (!user) return;

    const existing = cartItems.find(
      item => item.product_id === productId && item.size === size && item.color === color
    );

    if (existing) {
      await updateQuantity(existing.id, existing.quantity + quantity);
    } else {
      const cartData = {
        user_id: user.id,
        product_id: productId,
        quantity,
        size,
        color,
      };
      await supabase.from('cart_items').insert(cartData as any);
      await fetchCart();
    }
  };

  const removeFromCart = async (itemId: string) => {
    await supabase.from('cart_items').delete().eq('id', itemId);
    await fetchCart();
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    await (supabase.from('cart_items').update as any)({ quantity }).eq('id', itemId);
    await fetchCart();
  };

  const clearCart = async () => {
    if (!user) return;
    await supabase.from('cart_items').delete().eq('user_id', user.id);
    await fetchCart();
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
