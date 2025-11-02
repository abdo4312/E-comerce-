import React, { useContext, useMemo } from 'react';
import { Product } from '../types';
import { CartContext } from '../context/CartContext';
import { ComparisonContext } from '../context/ComparisonContext';
import { CartPlusIcon, ChevronRightIcon, ScaleIcon, CheckCircleIcon } from './icons';
import { ProductCard } from './ProductCard';

interface ProductDetailProps {
  product: Product;
  allProducts: Product[]; // All products passed from App state
  onBack: () => void;
  onProductSelect: (product: Product) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, allProducts, onBack, onProductSelect }) => {
  const { addItem } = useContext(CartContext);
  const { addItem: addToCompare, removeItem: removeFromCompare, isInCompare, isFull } = useContext(ComparisonContext);
  const isSelectedForCompare = isInCompare(product.id);

  const relatedProducts = useMemo(() => {
    // Find products in the same subcategory, excluding the current one
    let related = allProducts.filter(p => 
        p.subcategory === product.subcategory && p.id !== product.id
    );

    // If not enough, find more from the same main category
    if (related.length < 4) {
        const categoryProducts = allProducts.filter(p =>
           p.category === product.category && p.id !== product.id && !related.find(rp => rp.id === p.id)
        );
        related = [...related, ...categoryProducts];
    }
    
    return related.slice(0, 4);
  }, [product, allProducts]);

  return (
    <div className="animate-fade-in">
       <style>{`
            @keyframes fade-in {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in { animation: fade-in 0.3s ease-out; }
        `}</style>

      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 font-semibold"
        >
          <ChevronRightIcon />
          <span>العودة</span>
        </button>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img src={product.imageUrl} alt={product.name} className="w-full h-auto max-h-[500px] object-contain rounded-lg shadow-md" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-4xl font-extrabold text-gray-900">{product.name}</h1>
            <p className="text-lg text-gray-500 mt-2">{product.author}</p>
            <div className="my-6">
              <span className="text-4xl font-bold text-blue-600">{product.price.toFixed(2)} جنيه</span>
            </div>
            <p className="text-gray-700 leading-relaxed flex-grow">
              {product.description || 'لا يوجد وصف متاح حاليًا لهذا المنتج.'}
            </p>
            <div className="mt-8 flex items-stretch gap-3">
                <button
                onClick={() => addItem(product)}
                className="flex-grow bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors flex items-center justify-center space-x-2"
                >
                <CartPlusIcon />
                <span>أضف إلى السلة</span>
                </button>
                 <button
                    onClick={() => {
                        isSelectedForCompare ? removeFromCompare(product.id) : addToCompare(product);
                    }}
                    disabled={!isSelectedForCompare && isFull}
                    title={isSelectedForCompare ? "إزالة من المقارنة" : (isFull ? "قائمة المقارنة ممتلئة" : "إضافة للمقارنة")}
                    className={`shrink-0 p-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2
                        ${isSelectedForCompare 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                        ${!isSelectedForCompare && isFull ? 'cursor-not-allowed bg-gray-300' : ''}
                    `}
                >
                    {isSelectedForCompare ? <CheckCircleIcon className="h-6 w-6" /> : <ScaleIcon className="h-6 w-6" />}
                    <span className="hidden md:inline">{isSelectedForCompare ? 'في المقارنة' : 'قارن'}</span>
                </button>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
         <div className="mt-16">
            <h2 className="text-3xl font-extrabold text-gray-900 border-r-4 border-blue-500 pr-4 mb-6">
                منتجات ذات صلة
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedProducts.map(related => (
                    <ProductCard 
                        key={related.id} 
                        product={related} 
                        onAddToCart={() => addItem(related)} 
                        onProductClick={onProductSelect}
                    />
                ))}
            </div>
         </div>
      )}
    </div>
  );
};
