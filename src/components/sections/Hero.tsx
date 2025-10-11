// src/components/sections/Hero.tsx
import { Button } from '@/components/ui/button';
import { MoveRight } from 'lucide-react';

const Hero = () => {
    // You can replace this with your actual image path in the public folder
    const backgroundImageUrl = 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2832&auto=format&fit=crop';

    return (
        <section
            className="relative h-screen flex items-center justify-center text-white"
            style={{
                backgroundImage: `url(${backgroundImageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black opacity-50"></div>

            <div className="relative z-10 container mx-auto px-4 text-left">
                <div className="max-w-2xl" data-aos="fade-up">
                    <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
                        Smart way to keep your money safe and secure
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 mb-8">
                        Transfer money within minutes and save money for your future. All of your desired service in single platform.
                    </p>
                    <Button size="lg" className="bg-accent-red hover:bg-red-700 text-white font-semibold">
                        GET STARTED <MoveRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default Hero;