import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
// FIX: Changed TrashIcon to Trash2Icon as it's the correct exported name.
import { CloseIcon, EmptyCartIcon, Trash2Icon } from './icons';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, onCheckout }) => {
  const { items, updateItemQuantity, removeItem, clearCart } = useContext(CartContext);
  const { user, login } = useContext(AuthContext);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-hidden={!isOpen}
    >
      <div
        className={`bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4 transform transition-all duration-300 ease-in-out ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-2xl font-bold text-gray-800">سلة التسوق</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
            <CloseIcon />
          </button>
        </div>
        
        <div className="p-5 max-h-[60vh] overflow-y-auto">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <EmptyCartIcon />
              <p className="mt-4 text-xl text-gray-500">سلتك فارغة حالياً.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {items.map(item => (
                <li key={item.id} className="flex items-center py-4">
                  <img src={item.imageUrl} alt={item.name} className="w-20 h-28 object-cover rounded-md"/>
                  <div className="flex-grow pr-4">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.author}</p>
                    <p className="font-bold text-blue-600 mt-1">{item.price.toFixed(2)} جنيه</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button onClick={() => updateItemQuantity(item.id, item.quantity - 1)} className="font-bold h-8 w-8 rounded-full border hover:bg-gray-100">-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateItemQuantity(item.id, item.quantity + 1)} className="font-bold h-8 w-8 rounded-full border hover:bg-gray-100">+</button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="mr-4 p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50">
                    {/* FIX: Changed TrashIcon to Trash2Icon */}
                    <Trash2Icon />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-5 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">المجموع الكلي:</span>
              <span className="text-2xl font-extrabold text-blue-700">{total.toFixed(2)} جنيه</span>
            </div>
             {user ? (
                <button
                    onClick={onCheckout}
                    className="w-full bg-green-500 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-600 transition-colors"
                >
                    الاستمرار لإتمام الطلب
                </button>
             ) : (
                <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="mb-3 text-yellow-800">يجب تسجيل الدخول أولاً للمتابعة.</p>
                    <button 
                        onClick={login}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
                        تسجيل الدخول بحساب Google
                    </button>
                </div>
             )}
            <button onClick={clearCart} className="w-full mt-2 text-sm text-gray-500 hover:text-red-600">
              إفراغ السلة
            </button>
          </div>
        )}
      </div>
    </div>
  );
};