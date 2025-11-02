import React from 'react';
import { Product, Category } from '../../types';
import { StatCard } from './StatCard';
import { BoxesIcon, TagsIcon, AlertTriangleIcon } from '../icons';

interface DashboardViewProps {
  products: Product[];
  categories: Category[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({ products, categories }) => {
  const totalProducts = products.length;
  const totalCategories = categories.length;
  const outOfStock = products.filter(p => p.stock === 0).length;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="إجمالي المنتجات" value={totalProducts} icon={<BoxesIcon />} />
        <StatCard title="إجمالي الفئات" value={totalCategories} icon={<TagsIcon />} />
        <StatCard title="منتجات نفذت" value={outOfStock} icon={<AlertTriangleIcon />} />
      </div>
      {/* Could add charts or recent activity here in a real app */}
    </div>
  );
};
