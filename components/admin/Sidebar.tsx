import React from 'react';
import { LayoutDashboardIcon, BoxesIcon, TagsIcon, LogoutIcon, LibraryIcon } from '../icons';
import { ViewType } from './AdminDashboard';

interface SidebarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  onLogout: () => void;
}

const navItems: { view: ViewType, label: string, icon: React.ReactNode }[] = [
  { view: 'dashboard', label: 'لوحة المعلومات', icon: <LayoutDashboardIcon /> },
  { view: 'products', label: 'المنتجات', icon: <BoxesIcon /> },
  { view: 'categories', label: 'الفئات', icon: <TagsIcon /> },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, onLogout }) => {
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col flex-shrink-0">
      <div className="h-16 flex items-center justify-center px-4 border-b border-gray-700">
        <LibraryIcon className="h-8 w-8 text-blue-400" />
        <h1 className="text-xl font-bold ml-2">لوحة التحكم</h1>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navItems.map(item => (
          <button
            key={item.view}
            onClick={() => setActiveView(item.view)}
            className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeView === item.view 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="mr-3">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="px-2 py-4 border-t border-gray-700">
        <button
          onClick={onLogout}
          className="w-full flex items-center px-4 py-2 text-sm font-medium rounded-md text-red-300 hover:bg-red-700 hover:text-white transition-colors"
        >
          <LogoutIcon />
          <span className="mr-3">تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );
};
