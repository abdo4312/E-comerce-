import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Order, CartItem } from '../types';
import { CloseIcon, WhatsAppIcon } from './icons';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderConfirm: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onOrderConfirm }) => {
  const { items, total, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [phone, setPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<Order | null>(null);

  const handleInitiateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || items.length === 0 || !phone.trim()) {
      return;
    }
    setIsProcessing(true);

    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      items: [...items],
      total: total,
      status: 'pending',
      pickupTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      user: user,
      phone: phone,
    };
    setPendingOrder(newOrder);

    const itemsText = items.map(item => `- ${item.name} (x${item.quantity})`).join('\n');
    const message = `
*طلب جديد*
*العميل:* ${user.name}
*الهاتف:* ${phone}
*الطلب:*
${itemsText}
*الإجمالي: ${total.toFixed(2)} جنيه*
---
*الدفع والاستلام في المكتبة.*
*رقم الطلب للمتابعة:* ${newOrder.id}
    `;

    const encodedMessage = encodeURIComponent(message.trim().replace(/\n\s*\n/g, '\n'));
    const whatsappUrl = `https://wa.me/201105049122?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
    setShowConfirmation(true);
  };

  const handleFinalizeOrder = () => {
    if (pendingOrder) {
      onOrderConfirm(pendingOrder);
      clearCart();
    }
    resetState();
  };

  const handleCancelConfirmation = () => {
    resetState();
  };

  const resetState = () => {
    setPhone('');
    setIsProcessing(false);
    setShowConfirmation(false);
    setPendingOrder(null);
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-hidden={!isOpen}
    >
      <div
        className={`bg-white rounded-lg shadow-2xl w-full max-w-lg mx-4 transform transition-all duration-300 ease-in-out relative ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-2xl font-bold text-gray-800">إتمام الطلب</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
            <CloseIcon />
          </button>
        </div>
        
        <form onSubmit={handleInitiateOrder}>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">ملخص الطلب</h3>
            <div className="max-h-60 overflow-y-auto pr-2">
              {items.map((item: CartItem) => (
                <div key={item.id} className="flex justify-between items-center mb-2">
                  <span className="truncate">{item.name} <span className="text-gray-500 text-sm">(x{item.quantity})</span></span>
                  <span className="font-semibold">{(item.price * item.quantity).toFixed(2)} جنيه</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <span className="text-lg font-bold">المجموع الكلي:</span>
              <span className="text-2xl font-extrabold text-blue-700">{total.toFixed(2)} جنيه</span>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">بيانات الاستلام</h3>
              <p className="text-gray-600 mb-1">الاسم: <span className="font-medium">{user?.name}</span></p>
              <p className="text-gray-600 mb-4">البريد الإلكتروني: <span className="font-medium">{user?.email}</span></p>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف للتواصل</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="رقم واتساب صالح للتواصل"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="p-5 bg-gray-50 border-t rounded-b-lg">
            <div className="bg-blue-50 border border-blue-200 text-blue-800 text-center p-3 rounded-lg mb-4">
                <p className="font-semibold">تنبيه: الدفع يتم نقداً عند استلام الطلب من المكتبة.</p>
            </div>
            <button
              type="submit"
              disabled={isProcessing || !phone.trim()}
              className="w-full bg-green-500 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center space-x-3"
            >
              <WhatsAppIcon />
              <span>إتمام الطلب عبر واتساب</span>
            </button>
          </div>
        </form>

        {showConfirmation && (
          <div className="absolute inset-0 bg-white bg-opacity-95 z-10 flex flex-col justify-center items-center p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">هل تم إرسال الطلب؟</h3>
              <p className="text-gray-600 mb-6 text-center">يرجى تأكيد إرسال رسالة الطلب عبر واتساب لإتمام العملية.</p>
              <div className="flex space-x-4">
                  <button onClick={handleCancelConfirmation} className="px-6 py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300">
                      إلغاء
                  </button>
                  <button onClick={handleFinalizeOrder} className="px-6 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600">
                      نعم، تم الإرسال
                  </button>
              </div>
          </div>
        )}
      </div>
    </div>
  );
};