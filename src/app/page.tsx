import dynamic from 'next/dynamic';
import Hero from '@/components/home/Hero';
import TrustBadges from '@/components/home/TrustBadges';
import FeaturedCollection from '@/components/home/FeaturedCollection';

import type { Metadata } from 'next';

export const metadata: Metadata = {
    alternates: {
        canonical: '/',
    },
};

// Lazy load below-fold component to reduce initial JS bundle
const HomeHighlights = dynamic(() => import('@/components/home/HomeHighlights'), {
    loading: () => <div style={{ minHeight: '400px' }} />,
});

export default function HomePage() {
    return (
        <>
            <Hero />
            <TrustBadges />
            <FeaturedCollection />
            <HomeHighlights />
        </>
    );
}
