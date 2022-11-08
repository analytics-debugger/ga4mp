
# Installation
# Loading the library
<!-- tabs:start -->
#### **ES6 Imports**
```javascript
import ga4mp from 'analytics-debugger/ga4mp-tracking-library'
const ga4track = ga4mp(["G-THYNGSTER"], {  
  user_id: undefined,
  non_personalized_ads: true,
  debug: true
});
```
#### **Browser**
```javascript
<script src="https://cdn.analytics-debugger.com/ga4mp.js"
const ga4track = ga4mp(["G-THYNGSTER"], {  
  user_id: undefined,
  non_personalized_ads: true,
  debug: true
});
```
#### **NODE.JS**
```javascript
const ga4mp = require('./dist/ga4mp.cjs.prod').default
const ga4track = ga4mp(["G-THYNGSTER"], {  
  user_id: undefined,
  non_personalized_ads: true,
  debug: true
});
```
<!-- tabs:end -->
