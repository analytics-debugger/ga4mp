/**
 * Populate Page Related Details
 */
const pageDetails = () => {
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
export default pageDetails
