import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Our Story & Studio | Handmade Home Decor Mumbai',
    description: 'AdvayDecor is a premium home decor brand based in Dahisar East, Mumbai. Contact us for bespoke artisan cushions and accessories.',
    keywords: [
        'handmade home decor Mumbai',
        'artisan cushions Dahisar',
        'home decor brand Mumbai',
        'AdvayDecor story',
    ],
    openGraph: {
        title: 'Our Story & Studio | Handmade Home Decor Mumbai',
        description: 'AdvayDecor is a premium home decor brand based in Dahisar East, Mumbai.',
        type: 'website',
    },
};

export default function StoryLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
