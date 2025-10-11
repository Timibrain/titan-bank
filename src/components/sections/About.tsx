// src/components/sections/About.tsx
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MoveRight } from 'lucide-react';

const About = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Image Column */}
                    <div data-aos="fade-right">
                        <Image
                            src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=2787&auto=format&fit=crop"
                            alt="Business professionals collaborating"
                            width={600}
                            height={400}
                            className="rounded-lg shadow-xl"
                        />
                    </div>
                    {/* Content Column */}
                    <div data-aos="fade-left">
                        <h2 className="text-3xl md:text-4xl font-bold text-primary-blue mb-4">
                            About Us
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Titancapitaltrust is a micro banking system. We offers different types of financial services to our customers all over the world. We have multiple branches to provide different services such as Loan, Wire transfer, Long term deposit, savings and some other related services.
                        </p>
                        <Button size="lg" className="bg-accent-red hover:bg-red-700 text-white font-semibold">
                            SERVICES <MoveRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;