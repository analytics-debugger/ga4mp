// Internal interface for User Agent data (more comprehensive than the global UADataValues)
interface UserAgentData {
    platform?: string;
    platformVersion?: string;
    architecture?: string;
    model?: string;
    uaFullVersion?: string;
    bitness?: string;
    fullVersionList?: Array<{ brand: string; version: string }>;
    wow64?: boolean;
    mobile?: boolean;
    brands?: Array<{ brand: string; version: string }>;
}

interface ClientHintsData {
    _user_agent_architecture?: string;
    _user_agent_bitness?: string;
    _user_agent_full_version_list?: string;
    _user_agent_mobile?: number;
    _user_agent_model?: boolean | string;
    _user_agent_platform?: string;
    _user_agent_platform_version?: string;
    _user_agent_wow64?: number;
}

type ClientHintsMode = 'node' | 'browser';

declare global {
  interface NavigatorUABrand {
    brand: string;
    version: string;
  }

  interface UADataValues {
    platform: string;
    platformVersion: string;
    architecture: string;
    model: string;
    uaFullVersion: string;
  }

  interface Navigator {
    userAgentData?: {
      brands: NavigatorUABrand[];
      platform: string; // Add this
      mobile: boolean;
      getHighEntropyValues(hints: string[]): Promise<UADataValues>;
    };
  }
}

/**
 * Retrieves client hints from the browser's User-Agent Client Hints API
 * @param mode - The execution environment ('node' or 'browser')
 * @returns Promise resolving to client hints data or null if unavailable
 */
const clientHints = async (mode?: ClientHintsMode): Promise<ClientHintsData | null> => {
    // Handle non-browser environments
    if (mode === 'node' || typeof window === 'undefined' || (typeof window !== 'undefined' && !('navigator' in window))) {
        return null;
    }

    // Check for User-Agent Client Hints support
    if (!navigator?.userAgentData?.getHighEntropyValues) {
        return null;
    }

    try {
        // Get high entropy values from User-Agent Client Hints API
        const d = await navigator.userAgentData.getHighEntropyValues([
            'platform',
            'platformVersion',
            'architecture',
            'model',
            'uaFullVersion',
            'bitness',
            'fullVersionList',
            'wow64',
        ]) as UserAgentData;

        const versionList = d.fullVersionList || navigator?.userAgentData?.brands || [];
        
        return {
            _user_agent_architecture: d.architecture,
            _user_agent_bitness: d.bitness,
            _user_agent_full_version_list: encodeURIComponent(
                versionList
                    .map((h: { brand: string; version: string }) => `${h.brand};${h.version}`)
                    .join('|')
            ),
            _user_agent_mobile: d.mobile ? 1 : 0,
            _user_agent_model: d.model ?? navigator?.userAgentData?.mobile,
            _user_agent_platform: d.platform ?? navigator?.userAgentData?.platform,
            _user_agent_platform_version: d.platformVersion,
            _user_agent_wow64: d.wow64 ? 1 : 0,
        };
    } catch (error) {
        console.error('Error getting client hints:', error);
        return null;
    }
};

export default clientHints;