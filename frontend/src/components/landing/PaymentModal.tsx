import React, { useState, useEffect } from 'react';
import { 
  PaymentHeader, 
  PlanSelector, 
  PaymentSummary 
} from './PaymentModal/index';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    let scrollY = 0;
    if (isOpen) {
      scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      window.scrollTo(0, 0);
      document.body.dataset.scrollY = scrollY.toString();
    } else {
      document.body.style.overflow = '';
      if (document.body.dataset.scrollY) {
        window.scrollTo(0, parseInt(document.body.dataset.scrollY, 10));
        delete document.body.dataset.scrollY;
      }
    }
    return () => {
      document.body.style.overflow = '';
      if (document.body.dataset.scrollY) {
        window.scrollTo(0, parseInt(document.body.dataset.scrollY, 10));
        delete document.body.dataset.scrollY;
      }
    };
  }, [isOpen]);

  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  if (!isOpen) return null;

  const plans = [
    {
      id: 'pro',
      name: 'Pro',
      price: '$19',
      period: 'month',
      originalPrice: '$29',
      discount: '34% OFF',
      features: [
        'Unlimited image generations',
        'HD quality (up to 2048x2048)',
        'Priority processing',
        'All art styles',
        'Advanced settings',
        'Email support'
      ],
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$49',
      period: 'month',
      originalPrice: '$79',
      discount: '38% OFF',
      features: [
        'Everything in Pro',
        'Ultra HD quality (4K)',
        'Instant processing',
        'Custom AI models',
        'API access',
        'Priority support',
        'Commercial license'
      ]
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle payment processing
    console.log('Processing payment...', { selectedPlan, paymentMethod, cardDetails });
    // Simulate success
    alert('Payment successful! Welcome to Voice2Vision Pro!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" onClick={onClose} />
        
        <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          
          <PaymentHeader onClose={onClose} />

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Plan Selection */}
            <PlanSelector 
              plans={plans}
              selectedPlan={selectedPlan}
              onPlanSelect={setSelectedPlan}
            />

            {/* Payment Form */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
              <PaymentSummary 
                selectedPlan={selectedPlan}
                plans={plans}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                cardDetails={cardDetails}
                setCardDetails={setCardDetails}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;