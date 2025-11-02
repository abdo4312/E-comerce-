import React, { useState, useEffect, useMemo } from 'react';
import { Product, Category } from '../../types';
import { CloseIcon, UploadCloudIcon } from '../icons';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  product: Product | null;
  categories: Category[];
}

export const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSave, product, categories }) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    author: '',
    price: 0,
    stock: 0,
    imageUrl: '',
    category: '',
    subcategory: '',
    description: '',
    status: 'متوفر',
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        name: '', author: '', price: 0, stock: 0, imageUrl: '', category: categories[0]?.name || '', subcategory: '', description: '', status: 'متوفر',
      });
    }
  }, [product, categories]);

  const subcategoriesForSelectedCategory = useMemo(() => {
    const selected = categories.find(c => c.name === formData.category);
    return selected?.subcategories || [];
  }, [formData.category, categories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' || name === 'stock' ? Number(value) : value }));

    if (name === 'category') {
        // Reset subcategory when category changes
        const firstSub = categories.find(c => c.name === value)?.subcategories?.[0]?.name || '';
        setFormData(prev => ({...prev, subcategory: firstSub}));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalProduct: Product = {
        ...formData,
        id: product?.id || `prod-${Date.now()}`,
        dateAdded: product?.dateAdded || new Date().toISOString(),
    } as Product;
    onSave(finalProduct);
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">{product ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
          <button onClick={onClose}><CloseIcon /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Form fields */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">اسم المنتج</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700">المؤلف/الماركة</label>
              <input type="text" name="author" id="author" value={formData.author} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">السعر</label>
              <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700">المخزون</label>
              <input type="number" name="stock" id="stock" value={formData.stock} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">الفئة الرئيسية</label>
                <select name="category" id="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
            </div>
             <div>
                <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">الفئة الفرعية</label>
                <select name="subcategory" id="subcategory" value={formData.subcategory} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    {subcategoriesForSelectedCategory.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">رابط الصورة</label>
              <input type="text" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
             <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">الوصف</label>
                <textarea name="description" id="description" value={formData.description || ''} onChange={handleChange} rows={4} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
             <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">الحالة</label>
                <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <option value="متوفر">متوفر</option>
                    <option value="غير متوفر">غير متوفر</option>
                </select>
            </div>
          </div>
          <div className="mt-6 p-4 bg-gray-50 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">إلغاء</button>
            <button type="submit" className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700">حفظ</button>
          </div>
        </form>
      </div>
    </div>
  );
};
