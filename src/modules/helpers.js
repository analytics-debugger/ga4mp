export const trim = (str, chars) => {
    if (typeof str === 'string') {
        return str.substring(0, chars)
    } else {
        return str
    }
}
export const isFunction = (val) => {
    if (!val) return false
    return (
        Object.prototype.toString.call(val) === '[object Function]' ||
        (typeof val === 'function' &&
            Object.prototype.toString.call(val) !== '[object RegExp]')
    )
}
export const isNumber = (val) => 'number' === typeof val && !isNaN(val)
export const isObject = (val) =>
    val != null && typeof val === 'object' && Array.isArray(val) === false
export const isString = (val) => val != null && typeof val === 'string'
export const randomInt = () =>
    Math.floor(Math.random() * (2147483647 - 0 + 1) + 0)
export const timestampInSeconds = () => Math.floor((new Date() * 1) / 1000)
export const getEnvironment = () => {
    let env
    if (typeof window !== 'undefined' && typeof window.document !== 'undefined')
        env = 'browser'
    else if (
        typeof process !== 'undefined' &&
        process.versions != null &&
        process.versions.node != null
    )
        env = 'node'
    return env
}
/**
 * Logger Function
 * @param {string} message
 * @param {object} data
 */

export const log = (message, data) => {
    console.log('[GA4MP-LOG]', message, data)
}

/**
 * Populate Page Related Details
 */
export const pageDetails = () => {
    console.log('PAGE DETAIL')
    return {
        page_location: document.location.href,
        page_referrer: document.referrer,
        page_title: document.title,
        language: (
            (navigator && (navigator.language || navigator.browserLanguage)) ||
            ''
        ).toLowerCase(),
        screen_resolution:
            (window.screen ? window.screen.width : 0) +
            'x' +
            (window.screen ? window.screen.height : 0),
    }
}

/**
 * Function to sanitize values based on GA4 Model Limits
 * @param {string} val
 * @param {integer} maxLength
 * @returns
 */

export const sanitizeValue = (val, maxLength) => {
    // Trim a key-value pair value based on GA4 limits
    /*eslint-disable */
    try {
        val = val.toString()
    } catch (e) {}
    /*eslint-enable */
    if (!isString(val) || !maxLength || !isNumber(maxLength)) return val
    return trim(val, maxLength)
}
