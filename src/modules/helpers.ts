/**
 * Trims a string to a specified maximum length
 * @param value - The string to trim
 * @param maxLength - Maximum allowed length
 * @returns The trimmed string
 */
export const trim = (value: string, maxLength: number): string => {
  if (typeof value !== 'string') {
    value = String(value);
  }
  return value.length > maxLength ? value.substring(0, maxLength) : value;
};

/**
 * Checks if a value is a number (including numeric strings)
 * @param value - The value to check
 * @returns true if the value is a number or numeric string
 */
export const isNumber = (value: unknown): value is number | string => {
  if (typeof value === 'number') return true;
  if (typeof value === 'string') {
    return !isNaN(Number(value)) && !isNaN(parseFloat(value));
  }
  return false;
};

/**
 * Checks if a value is a function
 * @param value - The value to check
 * @returns true if the value is a function
 */
export const isFunction = (value: unknown): value is Function => {
  return typeof value === 'function';
};

/**
 * Gets the current environment (browser or node)
 * @returns 'browser' or 'node'
 */
export const getEnvironment = (): 'browser' | 'node' | null => {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    return 'browser';
  }
  if (typeof process !== 'undefined' && process.versions && process.versions.node) {
    return 'node';
  }
  return null;
};

/**
 * Generates a random integer
 * @returns A random integer
 */
export const randomInt = (): number => {
  return Math.floor(Math.random() * 2147483647);
};

/**
 * Gets the current timestamp in seconds
 * @returns Current timestamp in seconds
 */
export const timestampInSeconds = (): number => {
  return Math.floor(Date.now() / 1000);
};

/**
 * Sanitizes a value by converting to string and trimming to max length
 * @param value - The value to sanitize
 * @param maxLength - Maximum length for strings
 * @returns The sanitized string (never null/undefined)
 */
export const sanitizeValue = (value: unknown, maxLength: number): string => {
  if (value === null || value === undefined) {
    return '';
  }

  // Validate maxLength parameter
  if (typeof maxLength !== 'number' || maxLength < 0) {
    throw new Error('maxLength must be a non-negative number');
  }

  // Convert all non-string values to string with error handling
  let result: string;
  
  try {
    if (typeof value === 'object') {
      result = JSON.stringify(value);
    } else if (typeof value === 'boolean' || typeof value === 'number') {
      result = String(value);
    } else if (typeof value === 'string') {
      result = value;
    } else {
      // Handle functions, symbols, etc.
      result = String(value);
    }
  } catch (error) {
    console.warn('Failed to serialize value in sanitizeValue:', error instanceof Error ? error.message : String(error));
    result = '[Serialization Error]';
  }

  return trim(result, maxLength);
};