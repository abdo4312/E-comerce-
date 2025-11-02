import React from 'react';
import { LibraryIcon } from './icons';

export const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gray-50 flex flex-col justify-center items-center z-[100]">
      <div className="animate-pulse">
        <LibraryIcon className="h-24 w-24 text-blue-600" />
      </div>
      <h1 className="mt-6 text-3xl font-bold text-blue-600">المكتبة الإلكترونية</h1>
      <p className="mt-2 text-gray-500">جاري التحميل...</p>
    </div>
  );
};