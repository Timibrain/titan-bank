// src/components/sections/Stats.tsx
import { Users, Building, BarChart, Globe } from 'lucide-react';

const stats = [
    { value: '78005000', label: 'Customers', icon: <Users className="h-10 w-10 text-accent-red" /> },
    { value: '5', label: 'Branches', icon: <Building className="h-10 w-10 text-accent-red" /> },
    { value: '600 M', label: 'Total Transactions', icon: <BarChart className="h-10 w-10 text-accent-red" /> },
    { value: '5', label: 'Supported Country', icon: <Globe className="h-10 w-10 text-accent-red" /> },
];

const Stats = () => {
    return (
        <section className="bg-primary py-16 text-white"> {/* This line is the fix */}
            <div className="container mx-auto px-4" data-aos="fade-up">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex flex-col items-center">
                            {stat.icon}
                            <p className="text-4xl md:text-5xl font-bold mt-2 break-all">{stat.value}</p>
                            <p className="text-gray-300 mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;