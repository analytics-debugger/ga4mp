# GA4 Measurement Protocol (GA4MP)

A TypeScript/JavaScript library for Google Analytics 4 Measurement Protocol tracking. This library provides server-side and client-side tracking capabilities for GA4 with comprehensive type safety and security features.

## Features

- 🔒 **Security-focused** - Input validation, URL sanitization, and safe error handling
- 📦 **Minimal dependencies** - Lightweight with only build-time dependencies
- 🌐 **Universal compatibility** - Works in browsers and Node.js environments
- 🏷️ **TypeScript support** - Full type definitions and strict type checking
- ⚡ **High performance** - Optimized for GA4 measurement protocol
- 🧪 **Well tested** - Comprehensive test suite with mocking capabilities
- 📊 **GA4 compliant** - Full support for GA4 events, parameters, and ecommerce tracking

## Installation

```bash
npm install ga4mp
```

## Quick Start

```javascript
import ga4mp from 'ga4mp';

// Initialize tracker with measurement ID
const tracker = ga4mp('G-XXXXXXXXXX');

// Track a page view
tracker.trackEvent('page_view', {
  page_title: 'Home Page',
  page_location: 'https://example.com'
});

// Track custom events
tracker.trackEvent('button_click', {
  button_id: 'signup',
  event_category: 'engagement'
});

// Set user properties
tracker.setUserProperty('user_type', 'premium');
tracker.setUserId('user-123');

// Track ecommerce events
tracker.trackEvent('purchase', {
  transaction_id: 'order-456',
  value: 25.99,
  currency: 'USD',
  items: [{
    item_id: 'product-789',
    item_name: 'T-Shirt',
    category: 'Clothing',
    quantity: 1,
    price: 25.99
  }]
});
```

## API Reference

### `ga4mp(measurementIds: string | string[], config?: GA4Config)`

Creates a new GA4MP tracker instance.

**Parameters:**
- `measurementIds` (string | string[]): GA4 measurement ID(s) (e.g., 'G-XXXXXXXXXX')
- `config` (object, optional): Configuration options

**Returns:**
- `GA4MPInstance`: Tracker instance with methods for tracking

### Instance Methods

#### `trackEvent(eventName: string, eventParameters?: object, sessionControl?: object, forceDispatch?: boolean)`
Tracks a custom event with optional parameters.

#### `setUserProperty(key: string, value: any)`
Sets a user property that will be included in all future events.

#### `setEventsParameter(key: string, value: any)`
Sets a parameter that will be included in all future events.

#### `setUserId(userId: string)`
Sets the user ID for the tracker.

#### `getClientId(): string`
Returns the current client ID.

#### `getSessionId(): string`
Returns the current session ID.

#### `getHitIndex(): number`
Returns the current hit count.

## TypeScript Types

```typescript
interface GA4Config {
  debug?: boolean;
  client_id?: string;
  non_personalized_ads?: boolean;
  session_id?: string;
  session_number?: number;
  user_id?: string;
  user_ip_address?: string;
  user_agent?: string;
  hooks?: {
    beforeRequestSend: (payload: Record<string, any>, abort: () => void) => void;
  };
  endpoint?: string;
}

interface GA4MPInstance {
  version: string;
  mode: string;
  trackEvent: (eventName: string, eventParameters?: Record<string, any>, sessionControl?: Record<string, any>, forceDispatch?: boolean) => void;
  setUserProperty: (key: string, value: any) => void;
  setEventsParameter: (key: string, value: any) => void;
  setUserId: (value: string) => void;
  getClientId: () => string;
  getSessionId: () => string;
  getHitIndex: () => number;
}
```

## Event Types

The library supports all GA4 events including:

### Standard Events
- `page_view` - Page view tracking
- `scroll` - Scroll tracking
- `click` - Click tracking
- `form_start` - Form interaction start
- `form_submit` - Form submission

### Ecommerce Events
- `purchase` - Purchase transaction
- `add_to_cart` - Add item to cart
- `remove_from_cart` - Remove item from cart
- `view_item` - View product details
- `begin_checkout` - Start checkout process
- `add_payment_info` - Add payment information
- And many more...

## Configuration Options

### Environment Detection
The library automatically detects the execution environment (browser vs Node.js) and adapts accordingly:
- **Browser**: Uses `navigator.sendBeacon()` or `fetch()` for requests
- **Node.js**: Uses native HTTP/HTTPS modules

### Debug Mode
Enable debug mode to validate events against GA4's validation server:
```javascript
const tracker = ga4mp('G-XXXXXXXXXX', { debug: true });
```

## Error Handling

The library includes comprehensive error handling:

- URL validation to prevent SSRF attacks
- Input sanitization for all user-provided data
- Safe serialization with fallback handling
- Environment-specific error handling
- User-agent sanitization to prevent header injection
- Generic error messages to prevent information disclosure

## Security

Security features include:
- **URL validation**: Only HTTP/HTTPS endpoints allowed
- **Input sanitization**: All user data is sanitized and length-limited
- **Header injection protection**: User-Agent strings are sanitized
- **Safe serialization**: JSON operations wrapped in try-catch blocks
- **Error handling**: No sensitive information leaked in error messages
- **Environment isolation**: Different security models for browser vs Node.js

## Browser Support

Works in all modern browsers and JavaScript environments:
- Chrome/Chromium 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Node.js 14+

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build library (TypeScript compilation + Vite build)
npm run build

# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Changelog

### v1.0.0-beta.0
- Migration to TypeScript and Vite build system
- Enhanced security with URL validation and input sanitization
- Comprehensive test suite with Vitest
- Improved error handling and type safety
- Support for both browser and Node.js environments
- Full GA4 Measurement Protocol compliance
- ES5-compatible build for legacy browser support
- Async/await modernization for better code readability