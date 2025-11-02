import React, { createContext, useState, ReactNode, useMemo } from 'react';
import { Product } from '../types';

const MAX_COMPARE_ITEMS = 4;

interface ComparisonContextType {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  isFull: boolean;
  isInCompare: (productId: string) => boolean;
}

export const ComparisonContext = createContext<ComparisonContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  clear: () => {},
  isFull: false,
  isInCompare: () => false,
});

export const ComparisonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Product[]>([]);

  const isFull = useMemo(() => items.length >= MAX_COMPARE_ITEMS, [items]);

  const addItem = (product: Product) => {
    setItems(prevItems => {
      const exists = prevItems.some(item => item.id === product.id);
      if (exists || prevItems.length >= MAX_COMPARE_ITEMS) {
        return prevItems;
      }
      return [...prevItems, product];
    });
  };

  const removeItem = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productId));
  };
  
  const clear = () => {
    setItems([]);
  };
  
  const isInCompare = (productId: string) => {
    return items.some(item => item.id === productId);
  };

  return (
    <ComparisonContext.Provider value={{ items, addItem, removeItem, clear, isFull, isInCompare }}>
      {children}
    </ComparisonContext.Provider>
  );
};
