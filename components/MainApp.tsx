
import React, { useState, useMemo, useEffect } from 'react';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { ComparisonProvider } from '../context/ComparisonContext';
import { Header } from './Header';
import { Hero } from './Hero';
import { Categories } from './Categories';
import { FeaturedProducts } from './FeaturedProducts';
import { Footer } from './Footer';
import { CartModal } from './CartModal';
import { CheckoutModal } from './CheckoutModal';
import { OrderStatus } from './OrderStatus';
import { CategoryDetail } from './CategoryDetail';
import { ProductDetail } from './ProductDetail';
import { FilteredProductGrid } from './FilteredProductGrid';
import { ComparisonBar } from './ComparisonBar';
import { Category, Product, Order, OrderStatusType } from '../types';

interface MainAppProps {
  products: Product[];
  categories: Category[];
}

type ViewState = 
  | { view: 'main' }
  | { view: 'category'; category: Category }
  | { view: 'product'; product: Product }
  | { view: 'orderStatus'; order: Order }
  | { view: 'search'; query: string };


export const MainApp: React.FC<MainAppProps> = ({ products, categories }) => {
  const [isCartOpen, setCartOpen] = useState(false);
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const [viewState, setViewState] = useState<ViewState>({ view: 'main' });
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = products.filter(p =>
        p.name.toLowerCase().includes(lowercasedQuery) ||
        p.author.toLowerCase().includes(lowercasedQuery)
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, products]);

  const handleSelectCategory = (category: Category) => {
    setViewState({ view: 'category', category });
  };

  const handleSelectProduct = (product: Product) => {
    setViewState({ view: 'product', product });
  };
  
  const handleBackToMain = () => {
    setViewState({ view: 'main' });
    setSearchQuery(''); // Clear search query on returning to main
  };

  const handleOrderConfirmed = (order: Order) => {
    setCheckoutOpen(false);
    setViewState({ view: 'orderStatus', order });
  };
  
  const handleUpdateOrderStatus = (newStatus: OrderStatusType) => {
    if (viewState.view === 'orderStatus') {
      const updatedOrder = { ...viewState.order, status: newStatus };
      setViewState({ view: 'orderStatus', order: updatedOrder });
    }
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      setViewState({ view: 'search', query: query.trim() });
      setSuggestions([]);
    }
  };

  const searchedProducts = useMemo(() => {
    if (viewState.view !== 'search') return [];
    const query = viewState.query.toLowerCase();
    return products.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.author.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query))
    );
  }, [viewState, products]);

  const renderMainContent = () => {
    switch(viewState.view) {
      case 'category':
        return <CategoryDetail category={viewState.category} onBack={handleBackToMain} onProductSelect={handleSelectProduct} products={products} />;
      case 'product':
        return <ProductDetail product={viewState.product} onBack={handleBackToMain} onProductSelect={handleSelectProduct} allProducts={products} />;
      case 'orderStatus':
        return <OrderStatus order={viewState.order} onNewOrder={handleBackToMain} onUpdateStatus={handleUpdateOrderStatus} />;
      case 'search':
        return <FilteredProductGrid
          products={searchedProducts}
          filterName={`نتائج البحث عن "${viewState.query}"`}
          onClearFilter={handleBackToMain}
          onProductSelect={handleSelectProduct}
        />;
      case 'main':
      default:
        return (
          <>
            <Hero />
            <Categories onCategorySelect={handleSelectCategory} categories={categories} />
            <FeaturedProducts onProductSelect={handleSelectProduct} products={products} />
          </>
        );
    }
  }

  return (
    <AuthProvider>
      <CartProvider>
        <ComparisonProvider>
          <div className="flex flex-col min-h-screen">
            <Header 
              onCartClick={() => setCartOpen(true)}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearch={handleSearch}
              suggestions={suggestions}
            />
            <main className="flex-grow container mx-auto px-4 py-8 mb-24">
              {renderMainContent()}
            </main>
            <Footer />
          </div>
          
          <ComparisonBar />

          <CartModal 
            isOpen={isCartOpen} 
            onClose={() => setCartOpen(false)} 
            onCheckout={() => {
              setCartOpen(false);
              setCheckoutOpen(true);
            }}
          />

          <CheckoutModal 
            isOpen={isCheckoutOpen} 
            onClose={() => setCheckoutOpen(false)} 
            onOrderConfirm={handleOrderConfirmed}
          />
        </ComparisonProvider>
      </CartProvider>
    </AuthProvider>
  );
};