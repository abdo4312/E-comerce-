
import React, { useEffect, useState, useContext } from 'react';
import { Order, OrderStatusType } from '../types';
import { CheckCircleIcon, ClockIcon, PackageIcon, StoreIcon, BellIcon, MailIcon, XCircleIcon } from './icons';
import { AuthContext } from '../context/AuthContext';
import { generateOrderReadyEmail } from '../lib/gemini';

interface OrderStatusProps {
  order: Order;
  onNewOrder: () => void;
  onUpdateStatus: (newStatus: OrderStatusType) => void;
}

const statusSteps: { status: OrderStatusType; label: string; icon: React.ReactNode }[] = [
    { status: 'pending', label: 'قيد المراجعة', icon: <ClockIcon /> },
    { status: 'ready', label: 'جاهز للاستلام', icon: <PackageIcon /> },
    { status: 'completed', label: 'تم الاستلام', icon: <StoreIcon /> },
];

export const OrderStatus: React.FC<OrderStatusProps> = ({ order, onNewOrder, onUpdateStatus }) => {
    const { user } = useContext(AuthContext);
    const [notificationPermission, setNotificationPermission] = useState('default');
    const [notificationChoice, setNotificationChoice] = useState<'push' | 'email' | null>(null);
    const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
    const currentStatusIndex = statusSteps.findIndex(step => step.status === order.status);

    useEffect(() => {
        if ('Notification' in window) {
            setNotificationPermission(Notification.permission);
        }
    }, []);

    const handlePushNotificationRequest = async () => {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            setNotificationPermission(permission);
            setNotificationChoice('push');
        }
    };

    const handleEmailNotificationRequest = () => {
        if (user) {
            setNotificationChoice('email');
        }
    };

    useEffect(() => {
      let timer: number;
      if (order.status === 'pending') {
        timer = window.setTimeout(() => {
          onUpdateStatus('ready');
        }, 5000);
      } else if (order.status === 'ready') {
        timer = window.setTimeout(() => {
          onUpdateStatus('completed');
        }, 15000); // Increased time to allow user to see notification
      }
    
      return () => {
        if (timer) {
          clearTimeout(timer);
        }
      };
    }, [order.status, onUpdateStatus]);

    useEffect(() => {
        const sendNotification = async () => {
            if (order.status !== 'ready') return;
    
            if (notificationChoice === 'push' && notificationPermission === 'granted') {
                new Notification('طلبك جاهز للاستلام!', {
                    body: `طلبك رقم ${order.id} جاهز الآن. يمكنك استلامه من المكتبة.`,
                    icon: '/vite.svg',
                });
            } else if (notificationChoice === 'email' && user) {
                setIsGeneratingEmail(true);
                try {
                    const emailBody = await generateOrderReadyEmail(order.id, user.name);
                    // In a real app, you would send this via a backend service.
                    // Here, we'll just log it and show an alert for demonstration.
                    console.log("--- SIMULATED EMAIL ---");
                    console.log(`To: ${user.email}`);
                    console.log(`Subject: طلبك رقم ${order.id} جاهز للاستلام!`);
                    console.log(emailBody);
                    alert(`تم إرسال تنبيه إلى ${user.email} بأن الطلب جاهز.`);
                } catch (error) {
                    console.error("Failed to send email notification:", error);
                    alert("حدث خطأ أثناء محاولة إرسال تنبيه البريد الإلكتروني.");
                } finally {
                    setIsGeneratingEmail(false);
                }
            }
        };
        sendNotification();
    }, [order.status, order.id, notificationPermission, notificationChoice, user]);


    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <div className="text-center">
                <CheckCircleIcon />
                <h2 className="mt-4 text-3xl font-extrabold text-gray-900">تم إرسال طلبك بنجاح</h2>
                <p className="mt-2 text-lg text-gray-500">سيتم الرد عليك عبر واتساب خلال دقائق لتأكيد الطلب.</p>
                <p className="mt-1 font-semibold text-gray-700">رقم الطلب: <span className="font-mono text-blue-600">{order.id}</span></p>
            </div>

            {notificationPermission !== 'granted' && notificationChoice === null && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-center p-4 rounded-lg my-6">
                    <p className="font-semibold">هل تريد تلقي تحديثات حالة الطلب؟</p>
                    <p className="text-sm mt-1">اختر الطريقة التي تفضلها لتلقي الإشعارات.</p>
                    <div className="mt-3 flex flex-col sm:flex-row justify-center items-center gap-3">
                        <button 
                            onClick={handlePushNotificationRequest} 
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-2 px-4 rounded-md transition-colors"
                        >
                            <BellIcon className="h-5 w-5"/>
                            إشعارات المتصفح
                        </button>
                        <button 
                            onClick={handleEmailNotificationRequest}
                            disabled={!user || isGeneratingEmail}
                            title={!user ? "يجب تسجيل الدخول لتفعيل تنبيهات البريد الإلكتروني" : ""}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-400 hover:bg-blue-500 text-blue-900 font-bold py-2 px-4 rounded-md transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            <MailIcon className="h-5 w-5" />
                            {isGeneratingEmail ? 'جاري...' : 'تنبيهات البريد الإلكتروني'}
                        </button>
                    </div>
                </div>
            )}

            {(notificationChoice === 'email' || (notificationChoice === 'push' && notificationPermission === 'granted')) && (
                <div className="bg-green-50 border border-green-200 text-green-800 text-center p-4 rounded-lg my-6 flex items-center justify-center">
                    <CheckCircleIcon className="h-6 w-6 mr-3 text-green-600" />
                    <p>
                        {notificationChoice === 'email' && `سيتم إرسال التنبيهات إلى بريدك الإلكتروني: ${user?.email}`}
                        {notificationChoice === 'push' && notificationPermission === 'granted' && 'تم تفعيل إشعارات المتصفح بنجاح.'}
                    </p>
                </div>
            )}

            {notificationChoice === 'push' && notificationPermission === 'denied' && (
                <div className="bg-red-50 border border-red-200 text-red-800 text-center p-4 rounded-lg my-6 flex items-center justify-center">
                    <XCircleIcon className="h-6 w-6 mr-3 text-red-600" />
                    <p>تم رفض إذن الإشعارات. يرجى تفعيله من إعدادات المتصفح.</p>
                </div>
            )}


            <div className="mt-12">
                <h3 className="text-xl font-bold text-center mb-8">مراحل الطلب التالية</h3>
                <div className="relative">
                    <div className="absolute left-1/2 top-4 bottom-4 w-1 bg-gray-200 transform -translate-x-1/2"></div>
                    <div className="flex justify-between items-center text-center">
                        {statusSteps.map((step, index) => (
                             <div key={step.status} className="relative z-10 w-1/3">
                                <div className={`mx-auto h-12 w-12 rounded-full flex items-center justify-center transition-colors duration-500 ${index <= currentStatusIndex ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                    {step.icon}
                                </div>
                                <p className={`mt-2 font-semibold transition-colors duration-500 ${index <= currentStatusIndex ? 'text-blue-600' : 'text-gray-500'}`}>{step.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
             <div className="mt-12 text-center">
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
