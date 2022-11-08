
# Tracking
# Page Views

```javascript
ga4track.trackEvent('page_view')
```

# Events

```javascript
ga4track.trackEvent('click_outgoing', {
    clicked_url: 'https://www.thyngster.com',
    time: 12323
})
```

# Ecommerce

```javascript
    ga4track.trackEvent('view_item', {items: [{
            item_id: '615035',
            item_name: 'Asics Nimbus 23',
            item_brand: 'ASICS',
            item_category: 'men',
            item_category2: 'shoes',
            item_category3: undefined,
            item_category4: undefined,
            item_category5: undefined,
            item_variant: 'blue',
            discount: undefined,
            quantity: undefined,
            price: '180.00',
            currency: 'EUR',
            coupon: undefined,
            item_list_name: undefined,
            item_list_id: undefined,
            index: undefined,
            is_in_stock: 'yes',
            season: 'summer',
            size: '12',
            color: 'blue',
            type: 'trail running'
        }]});        

```
# User Properties
These can be set using the following code, and they will be attached to all the subsecuent hits.
```javascript
ga4track.setUserProperty('premium_member', 'yes')
```

# Event parameters
All the keys passes to tracker that are not reserved will be parsed as custom parameters, in the case we want to have an event parameter attached to
all the next events we can do the following
```javascript
ga4track.setEventsParameter('premium_member', 'yes')
```

# Event Values Callbacks
We can pass a function as a parameter and the value returned will be set as the value.

```javascript
ga4track.setEventsParameter('timestamp', ()=>{
    return new Date() * 1
})
```

# Marking a new session
Pass ```is_session_start``` as a paremeter to any call

```javascript
ga4track.trackEvent('page_view', { is_session_start: true})
```
# Marking a first Visit
Pass ```is_first_visit``` as a paremeter to any call
```javascript
ga4track.trackEvent('page_view', { is_first_visit: true})
```

# Tracking a conversion
```javascript
ga4track.trackEvent('lead_sent', {
  is_conversion : true
})
```
