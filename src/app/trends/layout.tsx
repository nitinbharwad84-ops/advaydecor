import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Home Decor Trends & Inspiration | AdvayDecor',
    description: 'Stay ahead of the curve with the latest home decor and cushion cover trends. Expert styling tips, seasonal guides, and design inspiration from AdvayDecor.',
    keywords: [
        'home decor trends 2026',
        'cushion trends',
        'bouclé cushions 2026',
        'floral cushion styling',
        'interior design trends India',
    ],
    openGraph: {
        title: 'Home Decor Trends & Inspiration | AdvayDecor',
        description: 'Stay ahead with the latest cushion cover and home decor trends.',
        type: 'website',
    },
};

export default function TrendsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
