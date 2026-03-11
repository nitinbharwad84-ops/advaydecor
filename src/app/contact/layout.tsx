import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us | Handmade Home Decor Mumbai - AdvayDecor',
    description: 'AdvayDecor is a premium home decor brand based in Dahisar East, Mumbai. Reach out for bespoke artisan cushions and accessories.',
    keywords: [
        'handmade home decor Mumbai',
        'artisan cushions Dahisar',
        'AdvayDecor contact',
    ],
    openGraph: {
        title: 'Contact Us | Handmade Home Decor Mumbai - AdvayDecor',
        description: 'Reach out to AdvayDecor — premium home decor from Dahisar East, Mumbai.',
        type: 'website',
    },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
