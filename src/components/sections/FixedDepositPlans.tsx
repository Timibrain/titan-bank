// src/components/sections/FixedDepositPlans.tsx
import PricingCard, { PlanDetail } from './PricingCard';

const plans = [
    {
        planName: 'Basic',
        rate: '8.00%',
        details: [
            { label: 'Duration', value: '12 Month' },
            { label: 'Interest Rate', value: '8.00 %' },
            { label: 'Minimum', value: '$10.00' },
            { label: 'Maximum', value: '$500.00' },
        ],
    },
    {
        planName: 'Standard',
        rate: '10.00%',
        details: [
            { label: 'Duration', value: '24 Month' },
            { label: 'Interest Rate', value: '10.00 %' },
            { label: 'Minimum', value: '$100.00' },
            { label: 'Maximum', value: '$1,000.00' },
        ],
    },
    {
        planName: 'Professional',
        rate: '15.00%',
        details: [
            { label: 'Duration', value: '36 Month' },
            { label: 'Interest Rate', value: '15.00 %' },
            { label: 'Minimum', value: '$500.00' },
            { label: 'Maximum', value: '$20,000.00' },
        ],
    },
];

const FixedDepositPlans = () => {
    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12" data-aos="fade-up">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary-blue">Fixed Deposit Plans</h2>
                    <p className="text-gray-500 mt-2">You will get maximum rewards with us by making long term deposit</p>
                    <div className="w-20 h-1 bg-accent-red mx-auto mt-4"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                    {plans.map((plan, index) => (
                        <PricingCard
                            key={index}
                            planName={plan.planName}
                            rate={plan.rate}
                            details={plan.details}
                            delay={index * 100}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FixedDepositPlans;