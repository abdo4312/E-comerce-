import React, { useContext } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { CartContext } from '../context/CartContext';
import { CloseIcon } from './icons';

interface FilteredProductGridProps {
  products: Product[];
  filterName: string;
  onClearFilter: () => void;
  onProductSelect: (product: Product) => void;
}

export const FilteredProductGrid: React.FC<FilteredProductGridProps> = ({ products, filterName, onClearFilter, onProductSelect }) => {
  const { addItem } = useContext(CartContext);

  return (
    <div className="my-12">
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <h2 className="text-3xl font-extrabold text-gray-900">
          نتائج لـ: <span className="text-blue-600">{filterName}</span>
        </h2>
        <button
          onClick={onClearFilter}
          className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-100 hover:bg-red-100 hover:text-red-600 px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
        >
          <CloseIcon />
          <span>مسح الفلتر</span>
        </button>
      </div>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={() => addItem(product)}
                onProductClick={onProductSelect}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm border">
          <p className="text-xl text-gray-500">عفواً، لا توجد منتجات تطابق هذا الفلتر حالياً.</p>
        </div>
      )}
    </div>
  );
};