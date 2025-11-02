import React, { useState, useMemo } from 'react';
import { Category, Product } from '../types';
import { FilteredProductGrid } from './FilteredProductGrid';
import { ChevronRightIcon } from './icons';

interface CategoryDetailProps {
  category: Category;
  products: Product[]; // All products passed from App state
  onBack: () => void;
  onProductSelect: (product: Product) => void;
}

export const CategoryDetail: React.FC<CategoryDetailProps> = ({ category, products, onBack, onProductSelect }) => {
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);

  const handleSubcategorySelect = (subcategoryName: string) => {
    setActiveSubcategory(subcategoryName);
  };

  const handleClearFilter = () => {
    setActiveSubcategory(null);
  };

  const filteredProducts = useMemo(() => {
    if (!activeSubcategory) return [];
    return products.filter(p => p.category === category.name && p.subcategory === activeSubcategory);
  }, [activeSubcategory, products, category.name]);

  return (
    <div className="animate-fade-in">
        <style>{`
            @keyframes fade-in {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in { animation: fade-in 0.3s ease-out; }
        `}</style>
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 font-semibold ml-4"
        >
          <ChevronRightIcon />
          <span>العودة للصفحة الرئيسية</span>
        </button>
      </div>

      {activeSubcategory ? (
        <FilteredProductGrid
          products={filteredProducts}
          filterName={activeSubcategory}
          onClearFilter={handleClearFilter}
          onProductSelect={onProductSelect}
        />
      ) : (
        <>
          <div className="text-center mb-8 pb-4 border-b">
            <h1 className="text-4xl font-extrabold text-gray-900">{category.name}</h1>
            <p className="mt-2 text-gray-500">اختر فئة فرعية لعرض المنتجات</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {(category.subcategories || []).map((sub) => (
              <button
                key={sub.id}
                onClick={() => handleSubcategorySelect(sub.name)}
                className="group bg-white rounded-lg shadow-md p-6 text-center transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300 border-b-4 border-transparent hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {sub.name}
                </h3>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};