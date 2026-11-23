import React from 'react';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useLanguage } from '../../../context/LanguageContext';
const Error404Page: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
          <AlertTriangle className="w-10 h-10 text-red-600" />
        </div>
        
        <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">{t('ui.page_not_found', 'Page Not Found')}</h2>
        
        <p className="text-gray-600 mb-8">
          {t('admin_ui.the_page_you_re_looking_for_doesn_t_exist_or', 'The page you\'re looking for doesn\'t exist or has been moved.')}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent-blue text-white rounded-lg hover:bg-[#152752] transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            {t('admin_ui.go_to_dashboard', 'Go to Dashboard')}
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('admin_ui.go_back', 'Go Back')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Error404Page;
