import React from 'react';
import { X, Crown } from 'lucide-react';

interface PaymentHeaderProps {
  onClose: () => void;
}

const PaymentHeader: React.FC<PaymentHeaderProps> = ({ onClose }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-3">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-xl">
          <Crown className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Upgrade to Pro</h2>
      </div>
      <button
        onClick={onClose}
        className="p-2 rounded-lg transition-colors hover:bg-gray-100 text-gray-600"
      >
        <X className="w-6 h-6" />
      </button>
    </div>
  );
};

export default PaymentHeader; 