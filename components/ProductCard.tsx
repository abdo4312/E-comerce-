import React, { useContext } from 'react';
import { Product } from '../types';
import { CartPlusIcon, ScaleIcon, CheckCircleIcon } from './icons';
import { ComparisonContext } from '../context/ComparisonContext';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onProductClick }) => {
  const { addItem: addToCompare, removeItem: removeFromCompare, isInCompare, isFull } = useContext(ComparisonContext);
  
  const isOutOfStock = product.status === 'غير متوفر' || product.stock === 0;
  const isSelectedForCompare = isInCompare(product.id);

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent navigation if the item is out of stock or a button is clicked
    if (isOutOfStock || (e.target as HTMLElement).closest('button')) {
      return;
    }
    onProductClick(product);
  };
  
  return (
    <div 
      className={`group bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 flex flex-col relative ${
        isOutOfStock 
        ? 'cursor-default' 
        : 'hover:shadow-xl cursor-pointer'
      }`}
      onClick={handleCardClick}
      role="button"
      aria-disabled={isOutOfStock}
      tabIndex={isOutOfStock ? -1 : 0}
      onKeyDown={(e) => !isOutOfStock && e.key === 'Enter' && handleCardClick(e as any)}
    >
      <div className="relative overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className={`w-full h-56 object-cover pointer-events-none transition-transform duration-300 ease-in-out group-hover:scale-110 ${isOutOfStock ? 'grayscale' : ''}`}
        />
        {isOutOfStock && (
          <>
            <div className="absolute inset-0 bg-white bg-opacity-50"></div>
            <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              نفذ المخزون
            </div>
          </>
        )}
         {!isOutOfStock && (
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    isSelectedForCompare ? removeFromCompare(product.id) : addToCompare(product);
                }}
                disabled={!isSelectedForCompare && isFull}
                title={isSelectedForCompare ? "إزالة من المقارنة" : (isFull ? "قائمة المقارنة ممتلئة" : "إضافة للمقارنة")}
                className={`absolute top-3 right-3 h-9 w-9 rounded-full flex items-center justify-center transition-all duration-200
                    ${isSelectedForCompare 
                        ? 'bg-green-500 text-white' 
                        : 'bg-white bg-opacity-70 text-gray-800 hover:bg-opacity-100 hover:scale-110'
                    }
                    ${!isSelectedForCompare && isFull ? 'cursor-not-allowed bg-gray-300' : ''}
                `}
            >
                {isSelectedForCompare ? <CheckCircleIcon className="h-5 w-5" /> : <ScaleIcon className="h-5 w-5" />}
            </button>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-800 truncate" title={product.name}>{product.name}</h3>
        <p className="text-sm text-gray-500 mt-1">{product.author}</p>
        <div className="mt-4 flex-grow">
            <span className={`text-xl font-extrabold ${isOutOfStock ? 'text-gray-400' : 'text-blue-600'}`}>{product.price.toFixed(2)} جنيه</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click event from firing
            if (!isOutOfStock) onAddToCart(product);
          }}
          disabled={isOutOfStock}
          className={`mt-4 w-full py-2 px-4 rounded-md font-semibold transition-colors flex items-center justify-center space-x-2 ${
            isOutOfStock
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
          }`}
        >
          {isOutOfStock ? (
            <span>نفذ المخزون</span>
          ) : (
            <>
              <CartPlusIcon />
              <span>أضف إلى السلة</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};