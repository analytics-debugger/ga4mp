
# GA4MP - Google Analytics 4 Measurement Protocol

This is an open-source implementation for the *client-side* protocol used by **Google Analytics 4**. When I mention "**client-side**" is because it must be differentiated with the official [GA4 Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/ga4) offered by Google.
  
This library implements the public **Google Analytics 4** protocol to make possible to do a full server-side tracking using NODE/JS which is not actually possible with the official **Measurement Protocol** , which is meant only to augment the current GA4 data and it's not ready for doing a full tracking.
  
Main differences with the official offerser server-side protocol are:

- Trigger new sessions and visits starts
- Track Sessions attribution
- Override the User IP to populate the GEO Details
- View the hits on the DebugView
- Override ANY value you want
- Easily portable to other languages

If we compare this library with the official GTAG implementation.

 - Lightweight 8.7kb (<4kb compressed ) 95.6% Lighter than a GTAG Container
![image](https://user-images.githubusercontent.com/1494564/201500771-f54c592b-4f37-4ac1-9a89-87878987cc33.png)
 - Privacy Compliant: Full control over which cookies are created/read and sent to Google
 - Dual Tracking (send hits to multiple measurement Ids)

## Usage

#### **ES6 Imports**

    import  ga4mp  from  '@analytics-debugger/ga4mp'
    const  ga4track = ga4mp(["G-THYNGSTER"], {
    	user_id:  undefined,
    	non_personalized_ads:  true,
    	debug:  true
    });

#### **Browser**
<.script  src="https://cdn.jsdelivr.net/npm/@analytics-debugger/ga4mp@latest/dist/ga4mp.umd.min.js">< /script>

    const  ga4track  =  ga4mp(["G-THYNGSTER"],  {
    	user_id: undefined,
    	non_personalized_ads: true,
    	debug: true
    });

#### **NODE.JS**

    const  ga4mp = require('./dist/ga4mp')
    const  ga4track = ga4mp(["G-THYNGSTER"], {
    	user_id:  undefined,
    	non_personalized_ads:  true,
    	debug:  true
    });

# More API details
Read more at: https://ga4mp.dev/
