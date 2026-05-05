import crypto from 'crypto';

/**
 * Generates a cryptographically secure numeric OTP of the specified length.
 * For an 8-digit OTP, it returns a value between 10000000 and 99999999.
 */
export function generateOTP(length: number = 8): string {
    if (length <= 0) return '';

    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;

    // randomInt(min, max) is inclusive of min and exclusive of max
    return crypto.randomInt(min, max + 1).toString();
}

/**
 * Generates a cryptographically secure random string.
 * Useful for filenames or nonces.
 */
export function generateRandomString(bytes: number = 16): string {
    return crypto.randomBytes(bytes).toString('hex');
}
