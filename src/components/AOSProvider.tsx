// src/components/AOSProvider.tsx
'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles

export const AOSProvider = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        AOS.init({
            duration: 750, // values from 0 to 3000, with step 50ms
            once: true,    // whether animation should happen only once - while scrolling down
        });
    }, []);

    return <>{children}</>;
};