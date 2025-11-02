import React from 'react';

export const Hero: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg overflow-hidden mb-12 shadow-lg">
      <div className="absolute inset-0 bg-black opacity-30"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: "url('https://picsum.photos/seed/library-bg/1200/400')" }}
      ></div>
      <div className="relative container mx-auto px-6 py-24 text-center text-white">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">كل ما تحتاجه للدراسة والإبداع</h2>
        <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">من الكتب والروايات إلى الأدوات المدرسية والمكتبية، كل شيء في مكان واحد.</p>
        <button className="mt-8 bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-transform transform hover:scale-105 shadow-md">
          ابدأ التسوق الآن
        </button>
      </div>
    </div>
  );
};