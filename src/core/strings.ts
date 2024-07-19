/**
 * A class to handle string utils
 */
export class StringUtils {
    /**
     * Generates a random pseudo-unique string
     * @param length the length of the resulting string
     */
    public static generateUniqueString = (length: number = 16): string => {
        const array = new Uint8Array(length);
        window.crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
}