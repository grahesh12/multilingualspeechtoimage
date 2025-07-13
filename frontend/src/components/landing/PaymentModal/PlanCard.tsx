import React from 'react';
import { Check } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  originalPrice: string;
  discount: string;
  features: string[];
  popular?: boolean;
}

interface PlanCardProps {
  plan: Plan;
  isSelected: boolean;
  onSelect: (planId: string) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, isSelected, onSelect }) => {
  return (
    <div
      className={`relative rounded-xl border-2 p-4 transition-all duration-300 cursor-pointer ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300'
      } ${plan.popular ? 'ring-2 ring-yellow-400' : ''}`}
      onClick={() => onSelect(plan.id)}
    >
      {plan.popular && (
        <div className="absolute -top-2 left-4">
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium">
            Most Popular
          </span>
        </div>
      )}

      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-lg font-bold text-gray-900">{plan.name}</h4>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
            <span className="text-sm text-gray-500">/{plan.period}</span>
            <span className="text-sm line-through text-gray-400">{plan.originalPrice}</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
              {plan.discount}
            </span>
          </div>
        </div>
        <div className={`w-5 h-5 rounded-full border-2 ${
          isSelected 
            ? 'border-blue-500 bg-blue-500' 
            : 'border-gray-300'
        }`}>
          {isSelected && (
            <Check className="w-3 h-3 text-white m-0.5" />
          )}
        </div>
      </div>

      <ul className="space-y-2">
        {plan.features.slice(0, 4).map((feature, index) => (
          <li key={index} className="flex items-center text-sm text-gray-600">
            <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
            {feature}
          </li>
        ))}
        {plan.features.length > 4 && (
          <li className="text-sm text-blue-600 font-medium">
            +{plan.features.length - 4} more features
          </li>
        )}
      </ul>
    </div>
  );
};

export default PlanCard; 