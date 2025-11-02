import React, { useContext } from 'react';
import { ProductCard } from './ProductCard';
import { CartContext } from '../context/CartContext';
import { Product } from '../types';

interface FeaturedProductsProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products, onProductSelect }) => {
  const { addItem } = useContext(CartContext);
  // Using a slice of products for featured items
  const featured = products.slice(0, 4);

  return (
    <div className="mb-12">
      <h2 className="text-3xl font-extrabold text-gray-900 border-r-4 border-blue-500 pr-4 mb-6">
        الأكثر تميزاً
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {featured.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onAddToCart={() => addItem(product)} 
            onProductClick={onProductSelect}
            />
        ))}
      </div>
    </div>
  );
};