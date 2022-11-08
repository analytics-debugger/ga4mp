
# Campaign Attribution
We can pass and set our campaign attribution to any hit this way:

```javascript
ga4track.trackEvent('page_view', { 
    is_session_start: true, 
    is_first_visit: true,
    campaign_medium: 'cpc',
    campaign_source: 'google',                    
    campaign_name: 'gclid'
})
```
?> **Tip** or We could override the ```page_location``` to pass some utm variables.  .

| Parameter |   |
| ---------- | ------------------------------ |
| campaign_medium   | utm_medium|
| campaign_source  | utm_source |
| campaign_name  | utm_campaign |
| campaign_content  | utm_content |
| campaign_term  | utm_term |
| campaign_id  | utm_id |

