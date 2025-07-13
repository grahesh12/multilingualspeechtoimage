import React from 'react';
import PlanCard from './PlanCard';

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

interface PlanSelectorProps {
  plans: Plan[];
  selectedPlan: string;
  onPlanSelect: (planId: string) => void;
}

const PlanSelector: React.FC<PlanSelectorProps> = ({ plans, selectedPlan, onPlanSelect }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Plan</h3>
      <div className="space-y-4">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isSelected={selectedPlan === plan.id}
            onSelect={onPlanSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default PlanSelector; 