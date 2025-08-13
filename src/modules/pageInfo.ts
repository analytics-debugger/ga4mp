interface PageData {
    page_location: string;
    page_referrer: string;
    page_title: string;
    language: string;
    screen_resolution: string;
}

/**
 * Collects page-related details including location, referrer, title, language, and screen resolution
 * @returns An object containing page details
 * @throws Will throw an error if not run in a browser environment
 */
const pageDetails = (): PageData => {
    // Verify we're in a browser environment
    if (typeof document === 'undefined' || typeof window === 'undefined') {
        throw new Error('pageDetails can only be used in a browser environment');
    }

    try {
        return {
            page_location: document.location?.href || '',
            page_referrer: document.referrer || '',
            page_title: document.title || '',
            language: (
                navigator?.language || 
                (navigator as any)?.browserLanguage || // Type assertion for older browsers
                ''
            ).toLowerCase(),
            screen_resolution: `${window.screen?.width ?? 0}x${window.screen?.height ?? 0}`
        };
    } catch (error) {
        console.error('Error collecting page details:', error instanceof Error ? error.message : String(error));
        // Return safe defaults
        return {
            page_location: '',
            page_referrer: '',
            page_title: '',
            language: '',
            screen_resolution: '0x0'
        };
    }
};

export default pageDetails;