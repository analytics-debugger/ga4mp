
# Options
We can pass some settings to our tracker initalization, these are:

| Left Align |  Non&#8209;Breaking&nbsp;Header | Only Node|
| ---------- | ------------------------------ | |
| user_id    | Sets the userID                             | |
| client_id  | Sets the clientId, either way it will be autogenerated                             | |
| session_id  | Session ID   | |
| endpoint   | Endpoint URL         | |
| debug   | Show debug Messages |
| queueDispatchTime   | How often the queue should be dispached (in ms) ||
| queueDispatchMaxEvents   | How much events queue to force the queue dispatch  ||
| user_agent   | Override the User Agent|✓|
| user_ip_address   | Override the User Ip Address |
| non_personalized_ads   | dIsable ads personalization for all hits |


```javascript
window.ga4track = ga4mp(["G-THYNGSTER"], {
    user_id : '666'
    // client_id: '123123123123.123123123', // Generate it internally 
    session_id: '1667932429'          
    non_personalized_ads: true,    
    endpoint: 'https://region1.google-analytics.com/g/collect',
    debug: true,
    queueDispatchTime: 10000,
    queueDispatchMaxEvents: 50,
    user_agent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    non_personalized_ads: true
});
```

