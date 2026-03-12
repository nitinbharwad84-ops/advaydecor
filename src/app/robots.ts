import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.advaydecor.in';

    return {
        rules: [
            {
                userAgent: '*',
                allow: [
                    '/',
                    '/admin',
                    '/admin-login',
                    '/profile',
                    '/login',
                    '/cart',
                    '/checkout',
                    '/orders',
                ],
                disallow: [
                    '/api/',
                    '/_next/',
                    '/static/',
                    '/seo/',
                    '/seo-login/',
                ],
            },
            {
                userAgent: 'Googlebot',
                allow: ['/api/shopping-feed'],
            }
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
