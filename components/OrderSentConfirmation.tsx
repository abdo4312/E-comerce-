import React from 'react';
import { CheckCircleIcon } from './icons';

interface OrderSentConfirmationProps {
  onNewOrder: () => void;
}

export const OrderSentConfirmation: React.FC<OrderSentConfirmationProps> = ({ onNewOrder }) => {
  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg text-center my-12 animate-fade-in-up">
      <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
      <CheckCircleIcon />
      <h2 className="mt-4 text-3xl font-extrabold text-gray-900">تم إرسال الطلب بنجاح</h2>
      <p className="mt-2 text-lg text-gray-600 max-w-md mx-auto">
        شكراً لك! لقد تم إرسال طلبك عبر واتساب. سنقوم بمراجعته والرد عليك قريباً لتأكيد التفاصيل.
      </p>
      <div className="mt-8">
        <button 
          onClick={onNewOrder}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-transform transform hover:scale-105"
        >
          العودة للتسوق
        </button>
      </div>
    </div>
  );
};