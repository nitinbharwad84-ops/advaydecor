import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Buy Cushion Covers Online India - AdvayDecor Collection',
    description: 'Curated linen, embroidered & bouclé cushions for sofas. Discover premium artistic decor to match your space and your vibe.',
    keywords: [
        'cushion covers online India',
        'buy cushions online',
        'designer cushion covers',
        'embroidered cushion covers',
        'linen pillow covers India',
        'bouclé cushions 2026',
        'sofa cushion sets Mumbai',
        'AdvayDecor collection',
    ],
    openGraph: {
        title: 'Buy Cushion Covers Online India - AdvayDecor Collection',
        description: 'Curated linen, embroidered & bouclé cushions for sofas. Discover premium artistic decor.',
        type: 'website',
        url: '/shop',
    },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
