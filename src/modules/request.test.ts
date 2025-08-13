import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendRequest } from './request';

// Mock fetch for browser environment
global.fetch = vi.fn();
global.navigator = {
  sendBeacon: vi.fn()
} as any;

describe('sendRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('URL validation', () => {
    it('should reject invalid URLs', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      sendRequest('invalid-url', {}, 'browser');
      sendRequest('ftp://example.com', {}, 'browser');
      sendRequest('javascript:alert("xss")', {}, 'browser');
      
      expect(consoleSpy).toHaveBeenCalledTimes(3);
      expect(consoleSpy).toHaveBeenCalledWith('Invalid or unsafe endpoint URL:', 'invalid-url');
      
      consoleSpy.mockRestore();
    });

    it('should accept valid HTTP/HTTPS URLs', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      sendRequest('https://www.google-analytics.com/g/collect', { test: 'data' }, 'browser');
      sendRequest('http://localhost:8080/collect', { test: 'data' }, 'browser');
      
      expect(consoleSpy).not.toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });

  describe('browser mode', () => {
    it('should use sendBeacon when available', () => {
      const mockSendBeacon = vi.fn().mockReturnValue(true);
      global.navigator.sendBeacon = mockSendBeacon;
      
      sendRequest('https://example.com/collect', { event: 'test' }, 'browser');
      
      expect(mockSendBeacon).toHaveBeenCalledWith('https://example.com/collect?event=test');
    });

    it('should fall back to fetch when sendBeacon unavailable', () => {
      (global.navigator as any).sendBeacon = undefined;
      const mockFetch = vi.fn().mockResolvedValue({ ok: true });
      global.fetch = mockFetch;
      
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      sendRequest('https://example.com/collect', { event: 'test' }, 'browser');
      
      expect(consoleSpy).toHaveBeenCalledWith('navigator.sendBeacon not available, using fetch instead');
      expect(mockFetch).toHaveBeenCalledWith('https://example.com/collect?event=test', {
        method: 'GET',
        keepalive: true
      });
      
      consoleSpy.mockRestore();
    });
  });

  describe('payload serialization', () => {
    it('should handle serialization errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Create circular reference that will fail JSON.stringify
      const circular: any = { a: 1 };
      circular.b = circular;
      
      sendRequest('https://example.com/collect', circular, 'browser');
      
      expect(consoleSpy).toHaveBeenCalledWith('Failed to serialize payload:', expect.any(String));
      
      consoleSpy.mockRestore();
    });

    it('should properly encode URL parameters', () => {
      const mockSendBeacon = vi.fn().mockReturnValue(true);
      global.navigator.sendBeacon = mockSendBeacon;
      
      sendRequest('https://example.com/collect', { 
        event: 'test event',
        'special chars': 'value with spaces & symbols!'
      }, 'browser');
      
      const calledUrl = mockSendBeacon.mock.calls[0][0];
      expect(calledUrl).toContain('event=test+event');
      expect(calledUrl).toContain('special+chars=value+with+spaces+%26+symbols%21');
    });
  });
});