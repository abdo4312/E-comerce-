import React, { useContext, useState } from 'react';
import { ComparisonContext } from '../context/ComparisonContext';
import { ComparisonModal } from './ComparisonModal';
import { CloseIcon, ScaleIcon } from './icons';

export const ComparisonBar: React.FC = () => {
    const { items, removeItem, clear, isFull } = useContext(ComparisonContext);
    const [isModalOpen, setModalOpen] = useState(false);

    if (items.length === 0) {
        return null;
    }

    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-3 shadow-2xl-top z-40 transform translate-y-0 transition-transform duration-300">
                <div className="container mx-auto flex justify-between items-center gap-4">
                    <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
                        <h3 className="font-bold text-lg hidden sm:block shrink-0">قائمة المقارنة</h3>
                        <div className="flex items-center gap-2">
                            {items.map(item => (
                                <div key={item.id} className="relative group shrink-0">
                                    <img src={item.imageUrl} alt={item.name} className="h-12 w-12 rounded-full object-cover border-2 border-white"/>
                                    <button 
                                        onClick={() => removeItem(item.id)}
                                        className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="إزالة"
                                    >
                                        <CloseIcon className="h-3 w-3 text-white" />
                                    </button>
                                </div>
                            ))}
                             {isFull && <div className="text-sm text-yellow-400 shrink-0">القائمة ممتلئة</div>}
                        </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <button 
                            onClick={clear} 
                            className="text-sm text-gray-300 hover:text-white hover:underline"
                        >
                            مسح الكل
                        </button>
                        <button
                            onClick={() => setModalOpen(true)}
                            disabled={items.length < 2}
                            className="bg-blue-600 px-5 py-2 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <ScaleIcon className="h-5 w-5"/>
                            <span>قارن الآن ({items.length})</span>
                        </button>
                    </div>
                </div>
            </div>
            <ComparisonModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
        </>
    );
};
