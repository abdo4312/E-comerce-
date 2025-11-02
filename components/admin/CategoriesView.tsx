import React, { useState } from 'react';
import { Category, Product } from '../../types';
import { PencilIcon, Trash2Icon, PlusCircleIcon, BookOpenIcon, PencilIcon as PenIcon, NotebookIcon, PaintBrushIcon, OfficeSuppliesIcon, SearchIcon } from '../icons';

const iconMap: { [key: string]: React.ReactNode } = {
  BookOpenIcon: <BookOpenIcon className="h-6 w-6" />,
  PencilIcon: <PenIcon className="h-6 w-6" />,
  NotebookIcon: <NotebookIcon className="h-6 w-6" />,
  PaintBrushIcon: <PaintBrushIcon className="h-6 w-6" />,
  OfficeSuppliesIcon: <OfficeSuppliesIcon className="h-6 w-6" />,
};

interface CategoriesViewProps {
  categories: Category[];
  products: Product[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onAdd: () => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({ categories, products, onEdit, onDelete, onAdd }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const getProductCount = (categoryName: string) => {
    return products.filter(p => p.category === categoryName).length;
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="ابحث عن فئة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <button
          onClick={onAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 hover:bg-blue-700"
        >
          <PlusCircleIcon />
          <span>إضافة فئة جديدة</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الفئة</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عدد المنتجات</th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">إجراءات</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCategories.map((category) => (
              <tr key={category.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-blue-500">
                      {iconMap[category.icon] || <BookOpenIcon className="h-6 w-6" />}
                    </div>
                    <div className="mr-4">
                      <div className="text-sm font-medium text-gray-900">{category.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getProductCount(category.name)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button onClick={() => onEdit(category)} className="text-indigo-600 hover:text-indigo-900 p-1"><PencilIcon /></button>
                  <button onClick={() => onDelete(category)} className="text-red-600 hover:text-red-900 p-1"><Trash2Icon /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
