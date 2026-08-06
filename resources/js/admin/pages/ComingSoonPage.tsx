import React from 'react';
import { Link } from 'react-router-dom';
import { Construction, ArrowRight } from 'lucide-react';

interface ComingSoonPageProps {
  title?: string;
  description?: string;
  moduleName?: string;
}

const ComingSoonPage: React.FC<ComingSoonPageProps> = ({
  title = 'Coming Soon',
  description = 'This module is under development and will be available in a future update.',
  moduleName,
}) => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-6">
          <Construction className="w-8 h-8 text-primary-600" />
        </div>
        <h1 className="text-h3 text-neutral-900 mb-3">
          {moduleName ? `${moduleName}` : title}
        </h1>
        <p className="text-body-base text-neutral-500 mb-8 leading-relaxed">
          {description}
        </p>
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white rounded-lg text-body-sm font-medium hover:bg-neutral-800 transition-colors"
        >
          Back to Dashboard
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default ComingSoonPage;
