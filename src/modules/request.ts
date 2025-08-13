interface RequestOptions {
    user_agent?: string;
    timeout?: number;
    [key: string]: any;
}

type RequestMode = 'browser' | 'server';

/**
 * Validates that a URL is safe for making requests
 * @param url - The URL to validate
 * @returns true if the URL is safe, false otherwise
 */
const isValidUrl = (url: string): boolean => {
    try {
        const parsed = new URL(url);
        // Only allow HTTPS and HTTP protocols
        return parsed.protocol === 'https:' || parsed.protocol === 'http:';
    } catch {
        return false;
    }
};

/**
 * Sends a request to the specified endpoint with the given payload
 * @param endpoint - The URL endpoint to send the request to
 * @param payload - The data to send with the request
 * @param mode - The execution environment ('browser' or 'server')
 * @param opts - Additional options for the request
 */
export const sendRequest = (
    endpoint: string,
    payload: Record<string, any>,
    mode: RequestMode = 'browser',
    opts: RequestOptions = {}
): void => {
    // Validate endpoint URL for security
    if (!isValidUrl(endpoint)) {
        console.error('Invalid or unsafe endpoint URL:', endpoint);
        return;
    }

    // Convert payload to query string with error handling
    let qs: string;
    try {
        qs = new URLSearchParams(
            JSON.parse(JSON.stringify(payload))
        ).toString();
    } catch (error) {
        console.error('Failed to serialize payload:', error instanceof Error ? error.message : String(error));
        return;
    }

    const fullUrl = `${endpoint}?${qs}`;

    if (mode === 'browser') {
        // Browser environment using sendBeacon
        if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
            navigator.sendBeacon(fullUrl);
        } else {
            // Fallback for browsers without sendBeacon
            console.warn('navigator.sendBeacon not available, using fetch instead');
            fetch(fullUrl, {
                method: 'GET',
                keepalive: true,
                ...opts
            }).catch(err => {
                console.error('Failed to send request:', err);
            });
        }
    } else {
        // Server environment using Node.js HTTP/HTTPS modules
        try {
            const parsed = new URL(endpoint);
            const scheme = parsed.protocol.slice(0, -1); // Remove trailing colon
            
            if (scheme !== 'http' && scheme !== 'https') {
                throw new Error(`Unsupported protocol: ${scheme}`);
            }

            // Use static imports instead of dynamic require for security
            let req: any;
            if (scheme === 'https') {
                req = require('https');
            } else {
                req = require('http');
            }
            // Sanitize user agent to prevent header injection
            const sanitizedUserAgent = (opts.user_agent || 'GA4-Client')
                .replace(/[\r\n]/g, '') // Remove line breaks
                .substring(0, 500); // Limit length

            const options = {
                headers: {
                    'User-Agent': sanitizedUserAgent,
                    ...opts.headers
                },
                timeout: opts.timeout || 500,
                ...opts
            };

            const request = req.get(fullUrl, options, (resp: any) => {
                let data = '';
                resp.on('data', (chunk: Buffer) => {
                    data += chunk.toString();
                });
                resp.on('end', () => {
                    // Handle server side responses if needed
                    if (opts.onResponse) {
                        opts.onResponse(data, resp.statusCode);
                    }
                });
            });

            request.on('error', (err: Error) => {
                console.error('Request error:', err.message);
                if (opts.onError) {
                    opts.onError(err);
                }
            });

            request.on('timeout', () => {
                request.destroy();
                const err = new Error(`Request timed out after ${options.timeout}ms`);
                if (opts.onTimeout) {
                    opts.onTimeout(err);
                }
            });
        } catch (err) {
            console.error('Failed to send server request:', err);
            if (opts.onError) {
                opts.onError(err as Error);
            }
        }
    }
};