// src/components/layout/Footer.tsx
import Link from 'next/link';
import { Facebook, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-100 text-gray-700">
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Column 1: Logo & About */}
                    <div className="md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-white border-2 border-accent-red rounded-full flex items-center justify-center font-bold text-xl text-accent-red">
                                $
                            </div>
                            <span className="text-xl font-bold tracking-wider text-primary-blue">TITANCAPITALTRUST</span>
                        </Link>
                        <p className="max-w-md">
                            Titancapitaltrust is a micro banking system. We offers different types of financial services to our customers all over the world.
                        </p>
                        <div className="flex space-x-4 mt-6">
                            <Link href="#" className="text-primary-blue hover:text-accent-red">
                                <Facebook size={24} />
                            </Link>
                            <Link href="#" className="text-primary-blue hover:text-accent-red">
                                <Twitter size={24} />
                            </Link>
                            <Link href="#" className="text-primary-blue hover:text-accent-red">
                                <Linkedin size={24} />
                            </Link>
                        </div>
                    </div>

                    {/* Column 2: Quick Explore */}
                    <div>
                        <h3 className="font-bold text-lg text-primary-blue mb-4">Quick Explore</h3>
                        <ul className="space-y-2">
                            <li><Link href="/contact" className="hover:text-accent-red">Contact</Link></li>
                            <li><Link href="/about" className="hover:text-accent-red">About</Link></li>
                            <li><Link href="/services" className="hover:text-accent-red">Services</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Pages */}
                    <div>
                        <h3 className="font-bold text-lg text-primary-blue mb-4">Pages</h3>
                        <ul className="space-y-2">
                            <li><Link href="/privacy" className="hover:text-accent-red">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-accent-red">Terms & Condition</Link></li>
                            <li><Link href="/faq" className="hover:text-accent-red">FAQ</Link></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Sub-Footer */}
            <div className="border-t border-gray-300">
                <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-500">
                    <p>Copyright © 2024 Titancapitaltrust - All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;