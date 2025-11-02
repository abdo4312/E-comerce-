import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { AdminHeader } from './Header';
import { DashboardView } from './DashboardView';
import { ProductsView } from './ProductsView';
import { CategoriesView } from './CategoriesView';
import { ProductModal } from './ProductModal';
import { CategoryModal } from './CategoryModal';
import { DeleteModal } from './DeleteModal';
import { Product, Category } from '../../types';
import { AlertTriangleIcon } from '../icons';

export type ViewType = 'dashboard' | 'products' | 'categories';
export type ModalType = 'product' | 'category' | 'delete' | null;

interface AdminDashboardProps {
  products: Product[];
  categories: Category[];
  onSaveProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onSaveCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  categories,
  onSaveProduct,
  onDeleteProduct,
  onSaveCategory,
  onDeleteCategory,
  onLogout,
}) => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [editingItem, setEditingItem] = useState<Product | Category | null>(null);
  const [deletingItem, setDeletingItem] = useState<{ id: string, name: string, type: 'product' | 'category' } | null>(null);

  const openModal = (type: Exclude<ModalType, 'delete' | null>, item: Product | Category | null = null) => {
    setEditingItem(item);
    setActiveModal(type);
  };

  const openDeleteModal = (item: { id: string, name: string, type: 'product' | 'category' }) => {
    setDeletingItem(item);
    setActiveModal('delete');
  };

  const closeModal = () => {
    setActiveModal(null);
    setEditingItem(null);
    setDeletingItem(null);
  };

  const handleConfirmDelete = () => {
    if (deletingItem) {
      if (deletingItem.type === 'product') {
        onDeleteProduct(deletingItem.id);
      } else {
        onDeleteCategory(deletingItem.id);
      }
    }
    closeModal();
  };
  
  const renderActiveView = () => {
    switch (activeView) {
      case 'products':
        return <ProductsView products={products} categories={categories} onEdit={p => openModal('product', p)} onDelete={p => openDeleteModal({id: p.id, name: p.name, type: 'product'})} onAdd={() => openModal('product')} />;
      case 'categories':
        return <CategoriesView categories={categories} products={products} onEdit={c => openModal('category', c)} onDelete={c => openDeleteModal({id: c.id, name: c.name, type: 'category'})} onAdd={() => openModal('category')} />;
      case 'dashboard':
      default:
        return <DashboardView products={products} categories={categories} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeView={activeView} setActiveView={setActiveView} onLogout={onLogout} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader view={activeView} />
        <div className="bg-yellow-100 border-r-4 border-yellow-500 text-yellow-800 p-4 m-4 rounded-md shadow-sm" role="alert">
          <div className="flex items-center">
            <AlertTriangleIcon className="h-5 w-5 mr-3"/>
            <div>
              <p className="font-bold">تنبيه أمان</p>
              <p className="text-sm">أنت تستخدم بيانات الدخول الافتراضية. نوصي بشدة بتغييرها في أقرب وقت ممكن.</p>
            </div>
          </div>
        </div>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-8 pt-0">
          {renderActiveView()}
        </main>
      </div>

      {activeModal === 'product' && (
        <ProductModal 
          isOpen={true} 
          onClose={closeModal} 
          onSave={(p) => { onSaveProduct(p); closeModal(); }}
          product={editingItem as Product | null}
          categories={categories}
        />
      )}
      {activeModal === 'category' && (
        <CategoryModal
            isOpen={true}
            onClose={closeModal}
            onSave={(c) => { onSaveCategory(c); closeModal(); }}
            category={editingItem as Category | null}
        />
      )}
      {activeModal === 'delete' && (
        <DeleteModal
            isOpen={true}
            onClose={closeModal}
            onConfirm={handleConfirmDelete}
            itemName={deletingItem?.name || ''}
        />
      )}
    </div>
  );
};