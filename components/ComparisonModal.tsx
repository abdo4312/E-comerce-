import React, { useContext } from 'react';
import { Product } from '../types';
import { ComparisonContext } from '../context/ComparisonContext';
import { CartContext } from '../context/CartContext';
import { CloseIcon, Trash2Icon, CartPlusIcon } from './icons';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const attributes = [
  { key: 'author', label: 'المؤلف/الماركة' },
  { key: 'price', label: 'السعر' },
  { key: 'status', label: 'الحالة' },
  { key: 'stock', label: 'المخزون' },
  { key: 'description', label: 'الوصف' },
];

export const ComparisonModal: React.FC<ComparisonModalProps> = ({ isOpen, onClose }) => {
  const { items, removeItem } = useContext(ComparisonContext);
  const { addItem: addToCart } = useContext(CartContext);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800">مقارنة المنتجات ({items.length})</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200"><CloseIcon /></button>
        </div>
        
        <div className="flex-1 overflow-auto">
          <table className="min-w-full h-full border-separate" style={{borderSpacing: 0}}>
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5 min-w-[150px] sticky left-0 bg-gray-50 z-20 border-b">
                  الخاصية
                </th>
                {items.map(product => (
                  <th key={product.id} scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4 min-w-[250px] border-b">
                    <div className="flex flex-col items-center">
                      <img src={product.imageUrl} alt={product.name} className="w-24 h-36 object-cover rounded-md mb-2" />
                      <h3 className="font-bold text-gray-800 text-sm">{product.name}</h3>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {/* Actions Row */}
              <tr className="bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-gray-50 z-10 border-b">الإجراءات</td>
                {items.map(product => (
                  <td key={product.id} className="px-6 py-4 whitespace-nowrap text-center border-b">
                    <div className="flex flex-col items-center gap-2">
                        <button 
                        onClick={() => addToCart(product)}
                        className="w-full text-sm bg-blue-500 text-white px-3 py-2 rounded-md font-semibold hover:bg-blue-600 flex items-center justify-center gap-2"
                        >
                        <CartPlusIcon className="h-4 w-4" /> أضف للسلة
                        </button>
                        <button 
                        onClick={() => removeItem(product.id)}
                        className="w-full text-sm bg-red-100 text-red-700 px-3 py-2 rounded-md font-semibold hover:bg-red-200 flex items-center justify-center gap-2"
                        >
                        <Trash2Icon className="h-4 w-4" /> إزالة
                        </button>
                    </div>
                  </td>
                ))}
              </tr>
              {/* Attributes Rows */}
              {attributes.map(attr => (
                <tr key={attr.key}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white z-10 border-b">{attr.label}</td>
                  {items.map(product => (
                    <td key={product.id} className="px-6 py-4 text-sm text-gray-700 align-top border-b">
                      {attr.key === 'price' 
                          ? `${(product as any)[attr.key].toFixed(2)} جنيه`
                          : attr.key === 'description' 
                              ? <p className="whitespace-normal max-w-xs">{ (product as any)[attr.key] || '-' }</p>
                              : (product as any)[attr.key] || '-'
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
