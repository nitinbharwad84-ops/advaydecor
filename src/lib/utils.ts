/**
 * Format a number as Indian Rupee currency
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Format a date string into readable format
 */
export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

/**
 * Generate a URL-friendly slug from text
 */
export function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Truncate text to a specified length
 */
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

/**
 * cn - classname merge utility
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
    return classes.filter(Boolean).join(' ');
}

/**
 * Validate tracking IDs to prevent XSS/Injection
 */
export function isValidTrackingId(id: string, type: 'gtm' | 'ga4' | 'gtag' | 'pixel' | 'verification'): boolean {
    if (!id) return false;

    const patterns = {
        gtm: /^GTM-[A-Z0-9]{4,15}$/,
        ga4: /^G-[A-Z0-9]{4,15}$/,
        gtag: /^AW-[0-9]{5,20}$/,
        pixel: /^[0-9]{10,25}$/,
        verification: /^[a-zA-Z0-9_-]{20,100}$/
    };

    return patterns[type].test(id);
}
