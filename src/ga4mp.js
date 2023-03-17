import {
    trim,
    isNumber,
    isFunction,
    getEnvironment,
    randomInt,
    timestampInSeconds,
    sanitizeValue,
} from './modules/helpers'

import { ga4Schema, ecommerceEvents } from './modules/ga4Schema'
import { sendRequest } from './modules/request'
import clientHints from './modules/clientHints'
import pageDetails from './modules/pageInfo'

const version = '0.0.1-alpha.3'

/**
 * Main Class Function
 * @param {array|string} measurement_ids
 * @param {object} config
 * @returns
 */

const ga4mp = function (measurement_ids, config = {}) {
    if (!measurement_ids)
        throw 'Tracker initialization aborted: missing tracking ids'
    const internalModel = Object.assign(
        {
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
                beforeLoad: () => {},
                beforeRequestSend: () => {},
            },
            eventCallbacks: [],
            endpoint: 'https://www.google-analytics.com/g/collect',
            payloadData: {},
        },
        config
    )

    // Initialize Tracker Data
    internalModel.payloadData.protocol_version = 2
    internalModel.payloadData.tracking_id = Array.isArray(measurement_ids)
        ? measurement_ids
        : [measurement_ids]
    internalModel.payloadData.client_id = config.client_id
        ? config.client_id
        : [randomInt(), timestampInSeconds()].join('.')
    internalModel.payloadData._is_debug = config.debug ? 1 : undefined
    internalModel.payloadData.non_personalized_ads = config.non_personalized_ads
        ? 1
        : undefined
    internalModel.payloadData.hit_count = 1

    // Initialize Session Data
    internalModel.payloadData.session_id = config.session_id
        ? config.session_id
        : timestampInSeconds()
    internalModel.payloadData.session_number = config.session_number
        ? config.session_number
        : 1

    // Initialize User Data
    internalModel.payloadData.user_id = config.user_id
        ? trim(config.user_id, 256)
        : undefined
    internalModel.payloadData.user_ip_address = config.user_ip_address
        ? config.user_ip_address
        : undefined
    internalModel.userAgent = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 [GA4MP/${version}]`

    // Initialize Tracker Data
    if (internalModel === 'node' && config.user_agent) {
        internalModel.user_agent = config.user_agent
    }
    // Grab data only browser data
    if (internalModel.mode === 'browser') {
        const pageData = pageDetails()
        if (pageData) {
            internalModel.payloadData = Object.assign(
                internalModel.payloadData,
                pageData
            )
        }
    }
    /**
     * Dispatching Queue
     * TO-DO
     */
    const dispatchQueue = () => {
        internalModel.queue = []
    }

    /**
     * Grab current ClientId
     * @returns string
     */
    const getClientId = () => {
        return internalModel.payloadData.client_id
    }

    /**
     * Grab current Session ID
     * @returns string
     */
    const getSessionId = () => {
        return internalModel.payloadData.session_id
    }

    /**
     * Set an Sticky Event Parameter, it wil be attached to all events
     * @param {string} key
     * @param {string|number|Fn} value
     * @returns
     */
    const setEventsParameter = (key, value) => {
        if (isFunction(value)) {
            try {
                value = value()
            } catch (e) {}
        }
        key = sanitizeValue(key, 40)
        value = sanitizeValue(value, 100)
        internalModel['persistentEventParameters'][key] = value
    }

    /**
     * Add an events callback, it will be triggered for every track function call
     * @param {function} callback 
     * @returns
     */
    const addEventCallback = (callback) => {
        if (isFunction(callback)) {
                internalModel.eventCallbacks.push(callback)
        } else {
            console.error('callback is not a function')
        }

    }


    /**
     * setUserProperty
     * @param {*} key
     * @param {*} value
     * @returns
     */
    const setUserProperty = (key, value) => {
        key = sanitizeValue(key, 24)
        value = sanitizeValue(value, 36)
        internalModel['userProperties'][key] = value
    }

    /**
     * Generate Payload
     * @param {object} customEventParameters
     */
    const buildPayload = (eventName, customEventParameters) => {
        const payload = {}
        if (internalModel.payloadData.hit_count === 1)
            internalModel.payloadData.session_engaged = 1

        Object.entries(internalModel.payloadData).forEach((pair) => {
            const key = pair[0]
            const value = pair[1]
            if (ga4Schema[key]) {
                payload[ga4Schema[key]] =
                    typeof value === 'boolean' ? +value : value
            }
        })
        // GA4 Will have different Limits based on "unknown" rules
        // const itemsLimit = isP ? 27 : 10
        const eventParameters = Object.assign(
            JSON.parse(JSON.stringify(internalModel.persistentEventParameters)),
            JSON.parse(JSON.stringify(customEventParameters))
        )
        eventParameters.event_name = eventName
        Object.entries(eventParameters).forEach((pair) => {
            const key = pair[0]
            const value = pair[1]
            if (
                key === 'items' &&
                ecommerceEvents.indexOf(eventName) > -1 &&
                Array.isArray(value)
            ) {
                // only 200 items per event
                let items = value.slice(0, 200)
                for (let i = 0; i < items.length; i++) {
                    if (items[i]) {
                        const item = {
                            core: {},
                            custom: {},
                        }
                        Object.entries(items[i]).forEach((pair) => {
                            if (ga4Schema[pair[0]]) {
                                if (typeof pair[1] !== 'undefined')
                                    item.core[ga4Schema[pair[0]]] = pair[1]
                            } else item.custom[pair[0]] = pair[1]
                        })
                        let productString =
                            Object.entries(item.core)
                                .map((v) => {
                                    return v[0] + v[1]
                                })
                                .join('~') +
                            '~' +
                            Object.entries(item.custom)
                                .map((v, i) => {
                                    var customItemParamIndex =
                                        10 > i
                                            ? '' + i
                                            : String.fromCharCode(65 + i - 10)
                                    return `k${customItemParamIndex}${v[0]}~v${customItemParamIndex}${v[1]}`
                                })
                                .join('~')
                        payload[`pr${i + 1}`] = productString
                    }
                }
            } else {
                if (ga4Schema[key]) {
                    payload[ga4Schema[key]] =
                        typeof value === 'boolean' ? +value : value
                } else {
                    payload[(isNumber(value) ? 'epn.' : 'ep.') + key] = value
                }
            }
        })
        Object.entries(internalModel.userProperties).forEach((pair) => {
            const key = pair[0]
            const value = pair[1]
            if (ga4Schema[key]) {
                payload[ga4Schema[key]] =
                    typeof value === 'boolean' ? +value : value
            } else {
                payload[(isNumber(value) ? 'upn.' : 'up.') + key] = value
            }
        })
        return payload
    }

    /**
     * setUserId
     * @param {string} value
     * @returns
     */
    const setUserId = (value) => {
        internalModel.payloadData.user_id = sanitizeValue(value, 256)
    }

    /**
     * Track Event
     * @param {string} eventName
     * @param {object} eventParameters
     * @param {boolean} forceDispatch
     */
    const getHitIndex = () => {
        return internalModel.payloadData.hit_count
    }
    const trackEvent = (
        eventName,
        eventParameters = {},
        sessionControl = {},
        forceDispatch = true
    ) => {
        // We want to wait for the CH Promise to fullfill
        clientHints().then((ch) => {            
            if (ch) {                
                internalModel.payloadData = Object.assign(
                    internalModel.payloadData,
                    ch
                )                
            }
            const payload = buildPayload(eventName, eventParameters, sessionControl)
            // run callbacks here
            for (let index = 0; index < internalModel.eventCallbacks.length; index++) {
                let callbackFn = internalModel.eventCallbacks[index];
                try {
                callbackFn(internalModel.payloadData.user_id, eventName, eventParameters, internalModel.persistentEventParameters, internalModel.userProperties);
                } catch(e) {
                    console.error('callback failed: '+e)
                }
            }
            if (payload && forceDispatch) {
                for (let i = 0; i < payload.tid.length; i++) {
                    let r = JSON.parse(JSON.stringify(payload))
                    r.tid = payload.tid[i]               
                    sendRequest(internalModel.endpoint, r, internalModel.mode, {
                        user_agent: internalModel?.user_agent,
                    })
                }
                internalModel.payloadData.hit_count++
            } else {
                const eventsCount = internalModel.queue.push(event)
                if (eventsCount >= internalModel.queueDispatchMaxEvents) {
                    dispatchQueue()
                }
            }            
        })             
    }
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
        addEventCallback,
    }
}

export default ga4mp
