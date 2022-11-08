Welcome to GA4MP

# Introduction
 

This is an open-source implementation for the *client-side* protocol used by **Google Analytics 4**. When I mention "client-side" is because it must be differentiated with the official [GA4 Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/ga4) offered by Google.

This library will use the public protocol definition, to make possible to build a ful server-side tracking which is not actually possible with the official Measurement Protocol. Since it's meant onlyu to augment the current data and not for performing a full tracking.

Main differences with the official offerser server-side protocol are:

 - Trigger new sessions and visits starts
 - Track Sessions attribution
 - Override the User IP to populate the GEO Details
 - View the hits on the DebugView
 - Override ANY value you want
 - Full documentation offered for all the payload parameters , so this library can be ported to other languages.


Other in-built features are:

 - Lightweight <3kb, have a full control about how your data is sent to Google. ( *privacy*  )
 - Data is sanitized, this means that event keys and paremeters are trimmed to the right length, same with user properties and user Ids. 
 - We can use callback functions with over parameters values
 - Future inclusions of hooks. You'll be able to run some middleware to manage your sessions details using the localStorage, cookies or any other storage mechanism, of run a "**customTask**" to clean the hits before they are sent to Google Services
 - Parallel tracking, send hits to multiple Measurement ID's
 - Upcoming GTM Template upon this library is on some stable branch
 - Sending events to multiple Measurement IDs
      <li>Proper session handling: mark a session_start, first_visit, session_engaged values</li>
      <li>Event Parameters, User Properties Sanitization ( key, values length )</li>
      <li>Setting Attribution Parameters ( medium, source, campaign, )</li>
      <li>Pass the User Ip address so GEO data is populated ( for NODE.js Implementations )</li>
      <li>Setting the Engagment Time for the events</li>
      <li>Payload is built using friendly named keys that will automatically mapped into the payload ( check table below )</li>
      <li>Sending the hits to a custom endpoints</li>
      <li>Setting sticky values to events (no need to specify all the parameters for subsecuents events)</li>
      <li>Real Time debug issues reporting ( if any value is trimmed or skipped )</li>
      <li>If the environment is a browser, related dimensions will be auto-populated ( location, refererer, screen_size, language , etc)</li>