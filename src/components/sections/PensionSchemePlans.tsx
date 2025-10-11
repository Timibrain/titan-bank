// src/components/sections/PensionSchemePlans.tsx
import PricingCard from './PricingCard';

const plans = [
    {
        planName: 'Strater',
        rate: '5.00%',
        details: [
            { label: 'Currency', value: 'USD' },
            { label: 'Per Installment', value: '$50.00' },
            { label: 'Installment Interval', value: 'Every 1 Month' },
            { label: 'Interest Rate', value: '5.00' },
            { label: 'Total Installment', value: '36' },
            { label: 'Total Deposit', value: '$1,800.00' },
            { label: 'Matured Amount', value: '$1,890.00' },
        ],
    },
    {
        planName: 'Basic',
        rate: '10.00%',
        details: [
            { label: 'Currency', value: 'USD' },
            { label: 'Per Installment', value: '$100.00' },
            { label: 'Installment Interval', value: 'Every 30 Days' },
            { label: 'Interest Rate', value: '10.00' },
            { label: 'Total Installment', value: '100' },
            { label: 'Total Deposit', value: '$10,000.00' },
            { label: 'Matured Amount', value: '$11,000.00' },
        ],
    },
    {
        planName: 'Professional',
        rate: '15.00%',
        details: [
            { label: 'Currency', value: 'USD' },
            { label: 'Per Installment', value: '$200.00' },
            { label: 'Installment Interval', value: 'Every 30 Days' },
            { label: 'Interest Rate', value: '15.00' },
            { label: 'Total Installment', value: '120' },
            { label: 'Total Deposit', value: '$24,000.00' },
            { label: 'Matured Amount', value: '$27,600.00' },
        ],
    },
];

const PensionSchemePlans = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12" data-aos="fade-up">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary-blue">Deposit Pension Scheme</h2>
                    <p className="text-gray-500 mt-2">You will get maximum rewards with us by making Deposit Pension Scheme</p>
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

export default PensionSchemePlans;