
import React from 'react';
import { Category } from '../types';
import { BookOpenIcon, PencilIcon, NotebookIcon, PaintBrushIcon, OfficeSuppliesIcon } from './icons';

const iconMap: { [key: string]: React.ReactNode } = {
  BookOpenIcon: <BookOpenIcon />,
  PencilIcon: <PencilIcon />,
  NotebookIcon: <NotebookIcon />,
  PaintBrushIcon: <PaintBrushIcon />,
  OfficeSuppliesIcon: <OfficeSuppliesIcon />,
};

interface CategoriesProps {
    categories: Category[];
    onCategorySelect: (category: Category) => void;
}

export const Categories: React.FC<CategoriesProps> = ({ categories, onCategorySelect }) => {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-extrabold text-gray-900 border-r-4 border-blue-500 pr-4 mb-6">
        تصفح حسب الفئة
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
            <button
                key={category.id}
                onClick={() => onCategorySelect(category)}
                className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-5 flex items-center space-x-4 space-x-reverse text-right hover:border-blue-500 border border-transparent transform hover:-translate-y-1"
            >
                {category.imageUrl ? (
                  <img 
                    src={category.imageUrl} 
                    alt={category.name} 
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                ) : (
                    <div className="text-blue-500 group-hover:text-blue-600 transition-colors">
                        {iconMap[category.icon] || <BookOpenIcon />}
                    </div>
                )}
                <div className="flex-grow">
                    <span className="font-bold text-lg text-gray-800">{category.name}</span>
                </div>
            </button>
        ))}
      </div>
    </div>
  );
};