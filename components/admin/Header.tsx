import React from 'react';
import { ViewType } from './AdminDashboard';

interface AdminHeaderProps {
  view: ViewType;
}

const viewTitles: Record<ViewType, string> = {
  dashboard: 'لوحة المعلومات الرئيسية',
  products: 'إدارة المنتجات',
  categories: 'إدارة الفئات',
};

export const AdminHeader: React.FC<AdminHeaderProps> = ({ view }) => {
  return (
    <header className="h-16 bg-white border-b flex-shrink-0">
      <div className="px-8 h-full flex items-center">
        <h2 className="text-2xl font-bold text-gray-800">{viewTitles[view]}</h2>
      </div>
    </header>
  );
};