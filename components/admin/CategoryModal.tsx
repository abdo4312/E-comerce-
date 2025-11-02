import React, { useState, useEffect } from 'react';
import { Category, Subcategory } from '../../types';
import { CloseIcon, Trash2Icon } from '../icons';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Category) => void;
  category: Category | null;
}

const iconOptions = ['BookOpenIcon', 'PencilIcon', 'NotebookIcon', 'PaintBrushIcon', 'OfficeSuppliesIcon'];

export const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, onSave, category }) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('BookOpenIcon');
  const [description, setDescription] = useState('');
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [newSubcategoryName, setNewSubcategoryName] = useState('');

  useEffect(() => {
    if (category) {
      setName(category.name);
      setIcon(category.icon);
      setDescription(category.description || '');
      setSubcategories(category.subcategories || []);
    } else {
      // Reset form for new category
      setName('');
      setIcon('BookOpenIcon');
      setDescription('');
      setSubcategories([]);
    }
    setNewSubcategoryName(''); // Reset input on open
  }, [category, isOpen]);

  const handleAddSubcategory = () => {
    if (newSubcategoryName.trim() === '') return;
    const newSub: Subcategory = {
        id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: newSubcategoryName.trim()
    };
    setSubcategories([...subcategories, newSub]);
    setNewSubcategoryName('');
  };

  const handleDeleteSubcategory = (subId: string) => {
    setSubcategories(subcategories.filter(sub => sub.id !== subId));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalCategory: Category = {
      id: category?.id || `cat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      icon,
      description,
      subcategories,
    };
    onSave(finalCategory);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">{category ? 'تعديل الفئة' : 'إضافة فئة جديدة'}</h2>
          <button onClick={onClose}><CloseIcon /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label htmlFor="cat-name" className="block text-sm font-medium text-gray-700">اسم الفئة</label>
            <input type="text" id="cat-name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="cat-icon" className="block text-sm font-medium text-gray-700">الأيقونة</label>
            <select id="cat-icon" value={icon} onChange={e => setIcon(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              {iconOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
           <div>
            <label htmlFor="cat-description" className="block text-sm font-medium text-gray-700">الوصف</label>
            <textarea id="cat-description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
           
           {/* Subcategory Management */}
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الفئات الفرعية</label>
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  value={newSubcategoryName}
                  onChange={(e) => setNewSubcategoryName(e.target.value)}
                  placeholder="e.g., Science Fiction"
                  className="flex-grow border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <button 
                  type="button" 
                  onClick={handleAddSubcategory}
                  className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300"
                >
                  إضافة
                </button>
              </div>

              <div className="mt-3 max-h-40 overflow-y-auto space-y-2 border rounded-md p-2 bg-gray-50">
                {subcategories.length > 0 ? (
                  subcategories.map(sub => (
                    <div key={sub.id} className="flex justify-between items-center bg-white p-2 rounded-md shadow-sm">
                      <span>{sub.name}</span>
                      <button 
                        type="button"
                        onClick={() => handleDeleteSubcategory(sub.id)}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full"
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-3">لا توجد فئات فرعية.</p>
                )}
              </div>
           </div>


          <div className="p-4 bg-gray-50 flex justify-end space-x-3 sticky bottom-0">
            <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">إلغاء</button>
            <button type="submit" className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700">حفظ</button>
          </div>
        </form>
      </div>
    </div>
  );
};