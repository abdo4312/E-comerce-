import React from 'react';
import { FacebookIcon, TwitterIcon, InstagramIcon } from './icons';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold mb-4">المكتبة الإلكترونية</h3>
            <p className="text-gray-400">
              وجهتك الأولى لتصفح وشراء أحدث الكتب والروايات. نسعى لتوفير تجربة قراءة ممتعة وسهلة للجميع.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">روابط سريعة</h3>
             <ul className="text-gray-400 space-y-2">
                <li><a href="/" className="hover:text-white">الرئيسية</a></li>
             </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">تابعنا على</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><FacebookIcon /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><TwitterIcon /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><InstagramIcon /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} المكتبة الإلكترونية. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};