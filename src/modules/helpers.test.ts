import { describe, it, expect } from 'vitest';
import { trim, isNumber, isFunction, sanitizeValue } from './helpers';

describe('helpers', () => {
  describe('trim', () => {
    it('should trim string to specified length', () => {
      expect(trim('hello world', 5)).toBe('hello');
    });

    it('should return original string if shorter than max length', () => {
      expect(trim('hello', 10)).toBe('hello');
    });

    it('should convert non-strings to strings', () => {
      expect(trim(123 as any, 2)).toBe('12');
    });
  });

  describe('isNumber', () => {
    it('should return true for numbers', () => {
      expect(isNumber(123)).toBe(true);
      expect(isNumber(0)).toBe(true);
      expect(isNumber(-456)).toBe(true);
    });

    it('should return true for numeric strings', () => {
      expect(isNumber('123')).toBe(true);
      expect(isNumber('0')).toBe(true);
      expect(isNumber('-456')).toBe(true);
    });

    it('should return false for non-numeric values', () => {
      expect(isNumber('hello')).toBe(false);
      expect(isNumber(null)).toBe(false);
      expect(isNumber(undefined)).toBe(false);
      expect(isNumber({})).toBe(false);
    });
  });

  describe('isFunction', () => {
    it('should return true for functions', () => {
      expect(isFunction(() => {})).toBe(true);
      expect(isFunction(function() {})).toBe(true);
    });

    it('should return false for non-functions', () => {
      expect(isFunction('hello')).toBe(false);
      expect(isFunction(123)).toBe(false);
      expect(isFunction({})).toBe(false);
    });
  });

  describe('sanitizeValue', () => {
    it('should return empty string for null/undefined', () => {
      expect(sanitizeValue(null, 10)).toBe('');
      expect(sanitizeValue(undefined, 10)).toBe('');
    });

    it('should convert and trim values', () => {
      expect(sanitizeValue('hello world', 5)).toBe('hello');
      expect(sanitizeValue(123, 2)).toBe('12');
      expect(sanitizeValue(true, 10)).toBe('true');
    });

    it('should handle objects by JSON stringifying', () => {
      const obj = { key: 'value' };
      const result = sanitizeValue(obj, 100);
      expect(result).toBe('{"key":"value"}');
    });

    it('should throw error for invalid maxLength', () => {
      expect(() => sanitizeValue('test', -1)).toThrow('maxLength must be a non-negative number');
      expect(() => sanitizeValue('test', 'invalid' as any)).toThrow('maxLength must be a non-negative number');
    });
  });
});