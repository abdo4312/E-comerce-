import React, { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { CartIcon, GoogleIcon, LogoutIcon, ChevronDownIcon, BellIcon, ArchiveIcon, SearchIcon } from './icons';
import { Product } from '../types';

interface HeaderProps {
  onCartClick: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: (query: string) => void;
  suggestions: Product[];
}

export const Header: React.FC<HeaderProps> = ({ onCartClick, searchQuery, setSearchQuery, onSearch, suggestions }) => {
  const { user, login, logout } = useContext(AuthContext);
  const { items } = useContext(CartContext);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLFormElement>(null);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (productName: string) => {
    setSearchQuery(productName);
    onSearch(productName);
    setShowSuggestions(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-blue-600 hidden sm:block shrink-0">المكتبة الإلكترونية</h1>
        
        <form onSubmit={handleSearchSubmit} ref={searchContainerRef} className="flex-grow max-w-xl relative">
            <div className="relative">
                <input
                    type="search"
                    placeholder="ابحث عن كتاب، قلم، أو أي منتج..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    autoComplete="off"
                    className="w-full pl-10 pr-4 py-2 border rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                />
                <button type="submit" aria-label="Search" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-blue-600">
                    <SearchIcon />
                </button>
            </div>
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border z-50 overflow-hidden animate-fade-in-fast">
                 <style>{`
                    @keyframes fade-in-fast {
                        from { opacity: 0; transform: translateY(-5px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fade-in-fast { animation: fade-in-fast 0.2s ease-out; }
                `}</style>
                <ul>
                  {suggestions.map(product => (
                      <li key={product.id}>
                          <button
                              type="button"
                              onClick={() => handleSuggestionClick(product.name)}
                              className="w-full text-right px-4 py-3 hover:bg-gray-100 flex items-center gap-4 transition-colors"
                          >
                              <img src={product.imageUrl} alt={product.name} className="h-12 w-10 object-cover rounded-md flex-shrink-0" />
                              <div className="flex flex-col text-right overflow-hidden">
                                <span className="font-semibold text-gray-800 truncate">{product.name}</span>
                                <span className="text-sm text-gray-500 truncate">{product.author}</span>
                              </div>
                          </button>
                      </li>
                  ))}
                </ul>
              </div>
            )}
        </form>
        
        <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
          <button onClick={onCartClick} className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
            <CartIcon />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
          <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="flex items-center space-x-2 cursor-pointer">
                <img src={user.avatarUrl} alt={user.name} className="h-9 w-9 rounded-full" />
                <span className="font-semibold text-gray-700 hidden sm:inline">{user.name}</span>
                <ChevronDownIcon className="hidden sm:block" />
              </button>
              {isDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                   <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                     <ArchiveIcon /> <span className="mr-2">طلباتي السابقة</span>
                  </a>
                   <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                     <BellIcon /> <span className="mr-2">الإشعارات</span>
                  </a>
                  <div className="border-t my-1"></div>
                  <button onClick={() => { logout(); setDropdownOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    <LogoutIcon /> <span className="mr-2">تسجيل الخروج</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={login}
              className="flex items-center space-x-2 border border-gray-300 text-gray-600 px-3 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              title="تسجيل الدخول باستخدام Google"
            >
              <GoogleIcon className="h-5 w-5" />
              <span className="hidden sm:inline">الدخول بـ Google</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};