const clientHints = () => {
    if (!navigator?.userAgentData?.getHighEntropyValues)
        return new Promise((resolve) => {
            resolve(null)
        })
    return navigator.userAgentData
        .getHighEntropyValues([
            'platform',
            'platformVersion',
            'architecture',
            'model',
            'uaFullVersion',
            'bitness',
            'fullVersionList',
            'wow64',
        ])
        .then((d) => {
            return {
                _user_agent_architecture: d.architecture,
                _user_agent_bitness: d.bitness,
                _user_agent_full_version_list: encodeURIComponent(
                    d.fullVersionList
                        .map((h) => {
                            return [h.brand, h.version].join(';')
                        })
                        .join('|')
                ),
                _user_agent_mobile: d.mobile ? 1 : 0,
                _user_agent_model: d.model,
                _user_agent_platform: d.platform,
                _user_agent_platform_version: d.platformVersion,
                _user_agent_wow64: d.wow64 ? 1 : 0,
            }
        })
}
export default clientHints
