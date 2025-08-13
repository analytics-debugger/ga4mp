import { describe, it, expect, beforeEach, vi } from 'vitest';
import ga4mp from './index';

// Mock the modules that depend on browser/node environment
vi.mock('./modules/clientHints', () => ({
  default: vi.fn().mockResolvedValue(null)
}));

vi.mock('./modules/pageInfo', () => ({
  default: vi.fn().mockReturnValue({
    page_location: 'https://example.com',
    page_referrer: '',
    page_title: 'Test Page',
    language: 'en-us',
    screen_resolution: '1920x1080'
  })
}));

vi.mock('./modules/request', () => ({
  sendRequest: vi.fn()
}));

describe('GA4MP', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should throw error if no measurement IDs provided', () => {
      expect(() => ga4mp('')).toThrow('Tracker initialization aborted: missing tracking ids');
      expect(() => ga4mp(null as any)).toThrow('Tracker initialization aborted: missing tracking ids');
    });

    it('should initialize with single measurement ID', () => {
      const tracker = ga4mp('G-XXXXXXXXXX');
      expect(tracker.version).toBe('0.0.8');
      expect(tracker.mode).toBe('node'); // In test environment
    });

    it('should initialize with multiple measurement IDs', () => {
      const tracker = ga4mp(['G-XXXXXXXXXX', 'G-YYYYYYYYYY']);
      expect(tracker.getClientId()).toBeDefined();
      expect(tracker.getSessionId()).toBeDefined();
    });

    it('should accept configuration options', () => {
      const config = {
        debug: true,
        client_id: 'test-client-id',
        user_id: 'test-user-id'
      };
      const tracker = ga4mp('G-XXXXXXXXXX', config);
      expect(tracker.getClientId()).toBe('test-client-id');
    });
  });

  describe('public methods', () => {
    let tracker: ReturnType<typeof ga4mp>;

    beforeEach(() => {
      tracker = ga4mp('G-XXXXXXXXXX');
    });

    it('should have all required methods', () => {
      expect(typeof tracker.trackEvent).toBe('function');
      expect(typeof tracker.setUserProperty).toBe('function');
      expect(typeof tracker.setEventsParameter).toBe('function');
      expect(typeof tracker.setUserId).toBe('function');
      expect(typeof tracker.getHitIndex).toBe('function');
      expect(typeof tracker.getClientId).toBe('function');
      expect(typeof tracker.getSessionId).toBe('function');
    });

    it('should track events', () => {
      expect(() => {
        tracker.trackEvent('page_view', { page_title: 'Test' });
      }).not.toThrow();
    });

    it('should set user properties', () => {
      expect(() => {
        tracker.setUserProperty('custom_property', 'value');
      }).not.toThrow();
    });

    it('should set event parameters', () => {
      expect(() => {
        tracker.setEventsParameter('custom_param', 'value');
      }).not.toThrow();
    });

    it('should set user ID', () => {
      expect(() => {
        tracker.setUserId('test-user-123');
      }).not.toThrow();
    });

    it('should return hit index', () => {
      const hitIndex = tracker.getHitIndex();
      expect(typeof hitIndex).toBe('number');
      expect(hitIndex).toBeGreaterThan(0);
    });
  });
});