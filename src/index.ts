import {
    trim,
    isNumber,
    isFunction,
    getEnvironment,
    randomInt,
    timestampInSeconds,
    sanitizeValue,
} from './modules/helpers';

import { ga4Schema, ecommerceEvents } from './modules/ga4Schema';
import { sendRequest } from './modules/request';
import clientHints from './modules/clientHints';
import pageDetails from './modules/pageInfo';

const version = '1.0.0-beta.0';

interface GA4Config {
    debug?: boolean;
    client_id?: string;
    non_personalized_ads?: boolean;
    session_id?: string;
    session_number?: number;
    user_id?: string;
    user_ip_address?: string;
    user_agent?: string;
    hooks?: {
        beforeRequestSend: (payload: Record<string, any>, abort: () => void) => void;
    };
    endpoint?: string;
    [key: string]: any;
}

interface InternalModel {
    version: string;
    debug: boolean;
    mode: string;
    measurement_ids: string[] | null;
    queueDispatchTime: number;
    queueDispatchMaxEvents: number;
    queue: any[];
    eventParameters: Record<string, any>;
    persistentEventParameters: Record<string, any>;
    userProperties: Record<string, any>;
    user_agent: string;
    user_ip_address: string | null;
    hooks: {
        beforeRequestSend: (payload: Record<string, any>, abort: () => void) => void;
    };
    endpoint: string;
    payloadData: {
        protocol_version: number;
        tracking_id: string[];
        client_id: string;
        _is_debug?: number;
        non_personalized_ads?: number;
        hit_count: number;
        session_id: string;
        session_number: number;
        user_id?: string;
        user_ip_address?: string;
        session_engaged?: number;
        [key: string]: any;
    };
    [key: string]: any;
}

interface GA4MPInstance {
    version: string;
    mode: string;
    getHitIndex: () => number;
    getSessionId: () => string;
    getClientId: () => string;
    setUserProperty: (key: string, value: any) => void;
    setEventsParameter: (key: string, value: any) => void;
    setUserId: (value: string) => void;
    trackEvent: (
        eventName: string,
        eventParameters?: Record<string, any>,
        sessionControl?: Record<string, any>,
        forceDispatch?: boolean
    ) => void;
}

const ga4mp = function (measurement_ids: string | string[], config: GA4Config = {}): GA4MPInstance {
    if (!measurement_ids) {
        throw new Error('Tracker initialization aborted: missing tracking ids');
    }

    const internalModel: InternalModel = {
        version,
        debug: false,
        mode: getEnvironment() || 'browser',
        measurement_ids: null,
        queueDispatchTime: 5000,
        queueDispatchMaxEvents: 10,
        queue: [],
        eventParameters: {},
        persistentEventParameters: {},
        userProperties: {},
        user_agent: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 [GA4MP/${version}]`,
        user_ip_address: null,
        hooks: {
            beforeRequestSend: () => {},
        },
        endpoint: 'https://www.google-analytics.com/g/collect',
        payloadData: {
            protocol_version: 2,
            tracking_id: Array.isArray(measurement_ids) ? measurement_ids : [measurement_ids],
            client_id: config.client_id ? config.client_id : [randomInt(), timestampInSeconds()].join('.'),
            _is_debug: config.debug ? 1 : undefined,
            non_personalized_ads: config.non_personalized_ads ? 1 : undefined,
            hit_count: 1,
            session_id: config.session_id ? config.session_id : timestampInSeconds().toString(),
            session_number: config.session_number ? config.session_number : 1,
            user_id: config.user_id ? trim(config.user_id, 256) : undefined,
            user_ip_address: config.user_ip_address ? config.user_ip_address : undefined,
        },
        ...config,
    };

    internalModel.user_agent = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 [GA4MP/${version}]`;

    if (internalModel.mode === 'node' && config.user_agent) {
        internalModel.user_agent = config.user_agent;
    }

    if (internalModel.mode === 'browser') {
        const pageData = pageDetails();
        if (pageData) {
            internalModel.payloadData = {
                ...internalModel.payloadData,
                ...pageData,
            };
        }
    }

    const dispatchQueue = (): void => {
        internalModel.queue = [];
    };

    const getClientId = (): string => {
        return internalModel.payloadData.client_id;
    };

    const getSessionId = (): string => {
        return internalModel.payloadData.session_id;
    };

    const setEventsParameter = (key: string, value: any): void => {
        if (isFunction(value)) {
            try {
                value = value();
            } catch (error) {
                console.warn('Function execution failed in setEventsParameter:', error instanceof Error ? error.message : String(error));
                value = undefined;
            }
        }
        key = sanitizeValue(key, 40);
        value = sanitizeValue(value, 100);
        internalModel.persistentEventParameters[key] = value;
    };

    const setUserProperty = (key: string, value: any): void => {
        key = sanitizeValue(key, 24);
        value = sanitizeValue(value, 36);
        internalModel.userProperties[key] = value;
    };

    const buildPayload = (eventName: string, customEventParameters: Record<string, any> = {}): Record<string, any> => {
        const payload: Record<string, any> = {};
        if (internalModel.payloadData.hit_count === 1) {
            internalModel.payloadData.session_engaged = 1;
        }

        Object.entries(internalModel.payloadData).forEach(([key, value]) => {
            if (ga4Schema[key]) {
                payload[ga4Schema[key]] = typeof value === 'boolean' ? +value : value;
            }
        });

        const eventParameters = {
            ...JSON.parse(JSON.stringify(internalModel.persistentEventParameters)),
            ...JSON.parse(JSON.stringify(customEventParameters)),
            event_name: eventName,
        };

        Object.entries(eventParameters).forEach(([key, value]) => {
            if (
                key === 'items' &&
                ecommerceEvents.indexOf(eventName) > -1 &&
                Array.isArray(value)
            ) {
                const items = value.slice(0, 200);
                for (let i = 0; i < items.length; i++) {
                    if (items[i]) {
                        const item = {
                            core: {} as Record<string, any>,
                            custom: {} as Record<string, any>,
                        };
                        Object.entries(items[i]).forEach(([itemKey, itemValue]) => {
                            if (ga4Schema[itemKey]) {
                                if (typeof itemValue !== 'undefined') {
                                    item.core[ga4Schema[itemKey]] = itemValue;
                                }
                            } else {
                                item.custom[itemKey] = itemValue;
                            }
                        });
                        const productString =
                            Object.entries(item.core)
                                .map(([k, v]) => `${k}${v}`)
                                .join('~') +
                            '~' +
                            Object.entries(item.custom)
                                .map(([k, v], idx) => {
                                    const customItemParamIndex =
                                        idx < 10 ? `${idx}` : String.fromCharCode(65 + idx - 10);
                                    return `k${customItemParamIndex}${k}~v${customItemParamIndex}${v}`;
                                })
                                .join('~');
                        payload[`pr${i + 1}`] = productString;
                    }
                }
            } else {
                if (ga4Schema[key]) {
                    payload[ga4Schema[key]] = typeof value === 'boolean' ? +value : value;
                } else {
                    payload[(isNumber(value) ? 'epn.' : 'ep.') + key] = value;
                }
            }
        });

        Object.entries(internalModel.userProperties).forEach(([key, value]) => {
            if (ga4Schema[key]) {
                payload[ga4Schema[key]] = typeof value === 'boolean' ? +value : value;
            } else {
                payload[(isNumber(value) ? 'upn.' : 'up.') + key] = value;
            }
        });

        return payload;
    };

    const setUserId = (value: string): void => {
        internalModel.payloadData.user_id = sanitizeValue(value, 256).toString();
    };

    const getHitIndex = (): number => {
        return internalModel.payloadData.hit_count;
    };

    const trackEvent = (
        eventName: string,
        eventParameters: Record<string, any> = {},
        _sessionControl: Record<string, any> = {},
        forceDispatch: boolean = true
    ): void => {
        clientHints(internalModel?.mode as 'node' | 'browser').then((ch) => {
            if (ch) {
                internalModel.payloadData = {
                    ...internalModel.payloadData,
                    ...ch,
                };
            }
            const payload = buildPayload(eventName, eventParameters);
            if (payload && forceDispatch) {
                for (let i = 0; i < payload.tid.length; i++) {
                    const r = JSON.parse(JSON.stringify(payload));
                    r.tid = payload.tid[i];
                    sendRequest(internalModel.endpoint, r, internalModel.mode as 'browser' | 'server', {
                        user_agent: internalModel?.user_agent,
                    });
                }
                internalModel.payloadData.hit_count++;
            } else {
                const eventsCount = internalModel.queue.push(payload);
                if (eventsCount >= internalModel.queueDispatchMaxEvents) {
                    dispatchQueue();
                }
            }
        });
    };

    return {
        version: internalModel.version,
        mode: internalModel.mode,
        getHitIndex,
        getSessionId,
        getClientId,
        setUserProperty,
        setEventsParameter,
        setUserId,
        trackEvent,
    };
};

export default ga4mp;