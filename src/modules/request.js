export const sendRequest = (endpoint, payload, mode = 'browser', opts = {}) => {
    let qs = new URLSearchParams(
        JSON.parse(JSON.stringify(payload))
    ).toString()
    if (opts.encode_search_params) {
        qs = encodeURIComponent(qs)
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
