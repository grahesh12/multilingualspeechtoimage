import React from 'react';

const TrustIndicators: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
      <div className="grid md:grid-cols-3 gap-8 text-center">
        <div>
          <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
          <div className="text-gray-600">Images Generated</div>
        </div>
        <div>
          <div className="text-4xl font-bold text-purple-600 mb-2">100+</div>
          <div className="text-gray-600">Languages Supported</div>
        </div>
        <div>
          <div className="text-4xl font-bold text-green-600 mb-2">99.9%</div>
          <div className="text-gray-600">Uptime Guarantee</div>
        </div>
      </div>
    </div>
  );
};

export default TrustIndicators; 