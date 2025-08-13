/**
 * GA4 Measurement Protocol Parameter Mapping
 * Maps human-readable parameter names to their abbreviated protocol equivalents
 */
export const ga4Schema: Record<string, string> = {
    _em: 'em',
    event_name: 'en',
    protocol_version: 'v',
    _page_id: '_p',
    _is_debug: '_dbg',
    tracking_id: 'tid',
    hit_count: '_s',
    user_id: 'uid',
    client_id: 'cid',
    page_location: 'dl',
    language: 'ul',
    firebase_id: '_fid',
    traffic_type: 'tt',
    ignore_referrer: 'ir',
    screen_resolution: 'sr',
    global_developer_id_string: 'gdid',
    redact_device_info: '_rdi',
    geo_granularity: '_geo',
    _is_passthrough_cid: 'gtm_up',
    _is_linker_valid: '_glv',
    _user_agent_architecture: 'uaa',
    _user_agent_bitness: 'uab',
    _user_agent_full_version_list: 'uafvl',
    _user_agent_mobile: 'uamb',
    _user_agent_model: 'uam',
    _user_agent_platform: 'uap',
    _user_agent_platform_version: 'uapv',
    _user_agent_wait: 'uaW',
    _user_agent_wow64: 'uaw',
    error_code: 'ec',
    session_id: 'sid',
    session_number: 'sct',
    session_engaged: 'seg',
    page_referrer: 'dr',
    page_title: 'dt',
    currency: 'cu',
    campaign_content: 'cc',
    campaign_id: 'ci',
    campaign_medium: 'cm',
    campaign_name: 'cn',
    campaign_source: 'cs',
    campaign_term: 'ck',
    engagement_time_msec: '_et',
    event_developer_id_string: 'edid',
    is_first_visit: '_fv',
    is_new_to_site: '_nsi',
    is_session_start: '_ss',
    is_conversion: '_c',
    euid_mode_enabled: 'ecid',
    non_personalized_ads: '_npa',
    create_google_join: 'gaz',
    is_consent_update: 'gsu',
    user_ip_address: '_uip',
    google_consent_state: 'gcs',
    google_consent_update: 'gcu',
    us_privacy_string: 'us_privacy',
    document_location: 'dl',
    document_path: 'dp',
    document_title: 'dt',
    document_referrer: 'dr',
    user_language: 'ul',
    document_hostname: 'dh',
    item_id: 'id',
    item_name: 'nm',
    item_brand: 'br',
    item_category: 'ca',
    item_category2: 'c2',
    item_category3: 'c3',
    item_category4: 'c4',
    item_category5: 'c5',
    item_variant: 'va',
    price: 'pr',
    quantity: 'qt',
    coupon: 'cp',
    item_list_name: 'ln',
    index: 'lp',
    item_list_id: 'li',
    discount: 'ds',
    affiliation: 'af',
    promotion_id: 'pi',
    promotion_name: 'pn',
    creative_name: 'cn',
    creative_slot: 'cs',
    location_id: 'lo',
    // legacy ecommerce
    id: 'id',
    name: 'nm',
    brand: 'br',
    variant: 'va',
    list_name: 'ln',
    list_position: 'lp',
    list: 'ln',
    position: 'lp',
    creative: 'cn'
} as const;

/**
 * Standard GA4 ecommerce event names
 */
export const ecommerceEvents: readonly string[] = [
    'add_payment_info',
    'add_shipping_info',
    'add_to_cart',
    'remove_from_cart',
    'view_cart',
    'begin_checkout',
    'select_item',
    'view_item_list',
    'select_promotion',
    'view_promotion',
    'purchase',
    'refund',
    'view_item',
    'add_to_wishlist'
] as const;

/**
 * Type representing valid GA4 ecommerce event names
 */
export type GA4EcommerceEvent = typeof ecommerceEvents[number];

/**
 * Type representing the GA4 parameter mapping schema
 */
export type GA4Schema = typeof ga4Schema;

/**
 * Reverse mapping of GA4 schema (protocol names to human-readable)
 */
export const reverseGa4Schema: Record<string, string> = Object.entries(ga4Schema).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
}, {} as Record<string, string>);

/**
 * Helper type for GA4 event parameters
 */
export interface GA4EventParams {
    [key: string]: any;
    items?: Array<{
        item_id?: string;
        item_name?: string;
        item_brand?: string;
        item_category?: string;
        item_category2?: string;
        item_category3?: string;
        item_category4?: string;
        item_category5?: string;
        item_variant?: string;
        price?: number;
        quantity?: number;
        coupon?: string;
        item_list_name?: string;
        item_list_id?: string;
        index?: number;
        discount?: number;
        affiliation?: string;
        promotion_id?: string;
        promotion_name?: string;
        creative_name?: string;
        creative_slot?: string;
        location_id?: string;
    }>;
}

/**
 * GA4 event interface
 */
export interface GA4Event {
    name: string;
    params?: GA4EventParams;
}