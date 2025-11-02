
import React, { useState } from 'react';
import { LoginPage } from './LoginPage';
import { AdminDashboard } from './AdminDashboard';
import { Product, Category } from '../../types';

interface AdminAppProps {
  products: Product[];
  categories: Category[];
  onSaveProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onSaveCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
}

// A simple in-memory session helper to persist login state across hot-reloads in development,
// but it will reset on a full page refresh.
const session = {
  isAuthenticated: false,
};

export const AdminApp: React.FC<AdminAppProps> = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(session.isAuthenticated);

  const handleLogin = () => {
    session.isAuthenticated = true;
    setIsAuthenticated(true);
  };
  
  const handleLogout = () => {
    session.isAuthenticated = false;
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLogin} />;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <AdminDashboard
        {...props}
        onLogout={handleLogout}
      />
    </div>
  );
};