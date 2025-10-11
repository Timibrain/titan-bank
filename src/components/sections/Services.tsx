// src/components/sections/Services.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, DollarSign, Repeat, University, FileText, HandCoins } from 'lucide-react';

const services = [
    {
        icon: <Send className="h-8 w-8 text-accent-red" />,
        title: 'Money Transfer',
        description: 'We offers you secure and easy transfer. Transfer money between users within a minutes.',
    },
    {
        icon: <DollarSign className="h-8 w-8 text-accent-red" />,
        title: 'Multi Currency',
        description: 'We supports multi currency. Bank conveniently with currencies of your choice.',
    },
    {
        icon: <Repeat className="h-8 w-8 text-accent-red" />,
        title: 'Exchange Currency',
        description: 'We offer lowest exchange fee so you can exchange your currency anytime.',
    },
    {
        icon: <University className="h-8 w-8 text-accent-red" />,
        title: 'Fixed Deposit',
        description: 'We offers long term investment and you will get good interest rate after maturity.',
    },
    {
        icon: <FileText className="h-8 w-8 text-accent-red" />,
        title: 'Apply Loan',
        description: 'We offers different types loan with low interest rate. You can get a loan easily.',
    },
    {
        icon: <HandCoins className="h-8 w-8 text-accent-red" />,
        title: 'Payment Request',
        description: 'You can send payment request to other users for receiving payments.',
    },
];

const Services = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12" data-aos="fade-up">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary-blue">Our Services</h2>
                    <p className="text-gray-500 mt-2">You can choose any of our services</p>
                    <div className="w-20 h-1 bg-accent-red mx-auto mt-4"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <Card
                            key={index}
                            className="text-center hover:shadow-xl transition-shadow duration-300"
                            data-aos="fade-up"
                            data-aos-delay={index * 100}
                        >
                            <CardHeader className="items-center">
                                {service.icon}
                                <CardTitle className="mt-4 text-primary-blue">{service.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">{service.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;