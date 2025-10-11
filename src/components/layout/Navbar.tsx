// src/components/layout/Navbar.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

const Navbar = () => {
    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Services', href: '/services' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Contact', href: '/contact' },
    ];

    return (
        <header className="absolute top-0 left-0 right-0 z-50 bg-transparent py-4">
            <div className="container mx-auto px-4 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    {/* You can replace this with an actual SVG or Image component */}
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-xl text-accent-red">
                        $
                    </div>
                    <span className="text-xl font-bold tracking-wider text-white">TITANCAPITALTRUST</span>
                </Link>

                {/* Navigation Links */}
                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link key={link.name} href={link.href} className="text-white hover:text-gray-300 transition-colors">
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    <Button asChild variant="outline" className="text-white border-white bg-transparent hover:bg-white hover:text-primary-blue">
                        <Link href="/auth/signup?view=login">Sign In</Link>
                    </Button>
                    <Button asChild className="bg-accent-red hover:bg-red-700 text-white">
                        <Link href="/auth/signup">Sign Up</Link>
                    </Button>
                    <Button variant="outline" size="sm" className="text-white border-white bg-transparent hover:bg-white hover:text-primary-blue">
                        <Globe className="h-4 w-4 mr-2" />
                        English
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;