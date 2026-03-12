import { Metadata } from 'next';
import StoryClient from './StoryClient';

export const metadata: Metadata = {
    title: 'Our Story | Handcrafted Artisanal Decor | Advay Decor',
    description: 'Learn about Advay Decor\'s journey, our commitment to artisanal craftsmanship, and our passion for creating beautiful, personalized living spaces.',
    alternates: {
        canonical: '/story',
    },
};

export default function StoryPage() {
    return <StoryClient />;
}
