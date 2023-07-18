export const sendRequest = (endpoint, payload, mode = 'browser', opts = {}) => {
    const payloadParsed = JSON.parse(JSON.stringify(payload))
    let qs = ''
    if (opts.encode_search_params) {
        // Ensure spaces are not replaced with +
        qs = Object.entries(payloadParsed)
            .map(([key, value]) => `${key}=${value}`)
            .join('&')
        qs = encodeURIComponent(qs)
    } else {
        qs = new URLSearchParams(
            payloadParsed
        ).toString()
    }
    if (mode === 'browser') {
        navigator?.sendBeacon([endpoint, qs].join('?'))
    } else {
        const scheme = endpoint.split('://')[0]
        const req = require(`${scheme}`)
        const options = {
            headers: {
                'User-Agent': opts.user_agent 
            },
            timeout: 500,
        }        
        const request = req
            .get([endpoint, qs].join('?'), options, (resp) => {
                let data = ''
                resp.on('data', (chunk) => {
                    data += chunk
                })
                resp.on('end', () => {
                    // TO-DO Handle Server Side Responses                    
                })
            })
            .on('error', (err) => {
                console.log('Error: ' + err.message)
            })
        request.on('timeout', () => {
            request.destroy()
        })
    }
}
