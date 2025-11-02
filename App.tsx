
import React, { useState, useEffect } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { MainApp } from './components/MainApp';
import { AdminApp } from './components/admin/AdminApp';
import { Product, Category } from './types';
import { supabase, isSupabaseConfigured } from './lib/supabaseClient';
import { mockProducts, mockCategories } from './data/mockData';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!isSupabaseConfigured || !supabase) {
        console.warn("Supabase not configured, falling back to mock data.");
        setProducts(mockProducts);
        setCategories(mockCategories);
        setIsLoading(false);
        return;
      }

      try {
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .order('dateAdded', { ascending: false });
        if (productsError) throw productsError;
        setProducts(productsData as Product[]);

        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('name', { ascending: true });
        if (categoriesError) throw categoriesError;
        setCategories(categoriesData as Category[]);

      } catch (error) {
        console.error("Error fetching data:", (error as any).message || error);
        // Fallback to mock data on error
        setProducts(mockProducts);
        setCategories(mockCategories);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSaveProduct = async (productToSave: Product) => {
    if (!isSupabaseConfigured || !supabase) {
      setProducts(prev => {
        const existing = prev.find(p => p.id === productToSave.id);
        if (existing) {
          return prev.map(p => p.id === productToSave.id ? productToSave : p);
        }
        return [...prev, { ...productToSave, id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` }];
      });
      return;
    }

    const isNew = typeof productToSave.id === 'string' && productToSave.id.startsWith('prod-');
    let payload;
    if (isNew) {
        const { id, ...rest } = productToSave;
        payload = rest;
    } else {
        payload = productToSave;
    }

    const { data, error } = await supabase
      .from('products')
      .upsert(payload)
      .select()
      .single();

    if (error) {
      console.error('Error saving product:', error.message || error);
    } else if (data) {
        if (isNew) {
            setProducts(prev => [data as Product, ...prev]);
        } else {
            setProducts(prev => prev.map(p => p.id === data.id ? data as Product : p));
        }
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!isSupabaseConfigured || !supabase) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      return;
    }
    
    const { error } = await supabase.from('products').delete().match({ id: productId });
    if (error) {
      console.error('Error deleting product:', error.message || error);
    } else {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  const handleSaveCategory = async (categoryToSave: Category) => {
     if (!isSupabaseConfigured || !supabase) {
        setCategories(prev => {
            const existing = prev.find(c => c.id === categoryToSave.id);
            if (existing) {
                return prev.map(c => c.id === categoryToSave.id ? categoryToSave : c);
            }
            return [...prev, { ...categoryToSave, id: `cat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` }];
        });
        return;
    }

    const isNew = typeof categoryToSave.id === 'string' && categoryToSave.id.startsWith('cat-');
    let payload;
    if (isNew) {
        const { id, ...rest } = categoryToSave;
        payload = rest;
    } else {
        payload = categoryToSave;
    }

    const { data, error } = await supabase
        .from('categories')
        .upsert(payload)
        .select()
        .single();
    
    if (error) {
        console.error('Error saving category:', error.message || error);
    } else if (data) {
        if (isNew) {
            setCategories(prev => [...prev, data as Category]);
        } else {
            setCategories(prev => prev.map(c => c.id === data.id ? data as Category : c));
        }
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
      if (!isSupabaseConfigured || !supabase) {
        setCategories(prev => prev.filter(c => c.id !== categoryId));
        return;
      }
      
      const { error } = await supabase.from('categories').delete().match({ id: categoryId });
      if (error) {
        console.error('Error deleting category:', error.message || error);
      } else {
        setCategories(prev => prev.filter(c => c.id !== categoryId));
      }
  };
  
  if (isLoading) {
    return <SplashScreen />;
  }

  // This logic determines whether to show the admin panel or the public store.
  const isAdminRoute = window.location.pathname.includes('/app-config-2024');

  if (isAdminRoute) {
    return (
      <AdminApp
        products={products}
        categories={categories}
        onSaveProduct={handleSaveProduct}
        onDeleteProduct={handleDeleteProduct}
        onSaveCategory={handleSaveCategory}
        onDeleteCategory={handleDeleteCategory}
      />
    );
  }

  return <MainApp products={products} categories={categories} />;
};

export default App;