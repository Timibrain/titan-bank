// src/components/sections/PricingCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface PlanDetail {
    label: string;
    value: string | number;
}

interface PricingCardProps {
    planName: string;
    rate: string;
    details: PlanDetail[];
    delay: number;
}

const PricingCard = ({ planName, rate, details, delay }: PricingCardProps) => {
    return (
        <Card
            className="flex flex-col"
            data-aos="fade-up"
            data-aos-delay={delay}
        >
            <CardHeader className="items-center text-center">
                <CardTitle className="text-accent-red text-xl font-semibold">{planName}</CardTitle>
                <p className="text-primary-blue text-4xl font-bold mt-2">{rate}</p>
            </CardHeader>
            <CardContent className="flex-grow">
                <ul className="space-y-4">
                    {details.map((detail, index) => (
                        <li key={index} className="flex justify-between border-b pb-2">
                            <span className="text-gray-600">{detail.label}</span>
                            <span className="font-semibold text-primary-blue">{detail.value}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
            <div className="p-6 pt-0">
                <Button className="w-full bg-primary-blue hover:bg-blue-900 text-black hover:text-white">
                    APPLY NOW
                </Button>
            </div>
        </Card>
    );
};

export default PricingCard;