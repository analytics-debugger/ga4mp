# getHitIndex
returns the current hit index

    /**
     * Grab current session Id
     * @returns number
     */

```javascript
tracker.getHitIndex()
```
# getSessionId
returns the current sessonId set on the tracker

    /**
     * Grab current session Id
     * @returns string
     */

```javascript
tracker.getSessionId()
```
# getClientId
returns the current clientId set on the tracker

    /**
     * Grab current ClientId
     * @returns string
     */

```javascript
tracker.getClientId()
```
# setUserProperty
Set's the user property to be attached to all hits

    /**
     * setUserProperty
     * @param {*} key 
     * @param {*} value 
     * @returns 
     */

```javascript
tracker.setUserProperty('lifetime_value_bucket', '200-300')
```

# setEventsParameter
The event Parameter set will persist accross the subsecuent hits.

    /**
     * Set an Sticky Event Parameter, it wil be attached to all events
     * @param {string} key
     * @param {string|number|Fn} value
     * @returns
     */

```javascript
tracker.setEventsParameter('logged_in')
```     
# setUserId

Set's the user_id ```&uid``` for all the next hits. Value is trimmed to 256 Characters

    /**
     * setUserId
     * @param {string} value
     * @returns
     */

```javascript
tracker.setUserId('my_user_client_id')
```