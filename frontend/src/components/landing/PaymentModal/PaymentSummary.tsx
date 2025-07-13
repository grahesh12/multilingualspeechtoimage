import React from 'react';
import PaymentForm from './PaymentForm';

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

interface PaymentSummaryProps {
  selectedPlan: string;
  plans: Plan[];
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  cardDetails: {
    number: string;
    expiry: string;
    cvv: string;
    name: string;
  };
  setCardDetails: (details: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({ 
  selectedPlan, 
  plans, 
  paymentMethod,
  setPaymentMethod,
  cardDetails,
  setCardDetails,
  onSubmit 
}) => {
  const selectedPlanData = plans.find(p => p.id === selectedPlan);

  return (
    <form onSubmit={onSubmit}>
      <PaymentForm 
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        cardDetails={cardDetails}
        setCardDetails={setCardDetails}
      />
      
      {/* Total */}
      <div className="border-t pt-4 mt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-medium text-gray-900">Total</span>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {selectedPlanData?.price}/month
            </div>
            <div className="text-sm text-gray-500">Billed monthly</div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
      >
        Complete Payment
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">
        By completing this purchase, you agree to our Terms of Service and Privacy Policy. 
        Cancel anytime with 30-day money-back guarantee.
      </p>
    </form>
  );
};

export default PaymentSummary; 