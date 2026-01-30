import { describe, it, expect } from 'vitest';
import { RowKeyExtractor } from './row-key.util';

describe('RowKeyExtractor', () => {
  describe('extract', () => {
    it('should extract the key value from an object', () => {
      const row = { id: 123, name: 'Test' };
      const key = RowKeyExtractor.extract(row, 'id');
      expect(key).toBe(123);
    });

    it('should return undefined if the key does not exist', () => {
      const row = { id: 123, name: 'Test' };
      const key = RowKeyExtractor.extract(row, 'nonexistent');
      expect(key).toBeUndefined();
    });

    it('should handle string keys', () => {
      const row = { id: 'abc-123', name: 'Test' };
      const key = RowKeyExtractor.extract(row, 'id');
      expect(key).toBe('abc-123');
    });

    it('should handle number keys', () => {
      const row = { id: 456, name: 'Test' };
      const key = RowKeyExtractor.extract(row, 'id');
      expect(key).toBe(456);
    });

    it('should return undefined for null row', () => {
      const key = RowKeyExtractor.extract(null, 'id');
      expect(key).toBeUndefined();
    });

    it('should return undefined for undefined row', () => {
      const key = RowKeyExtractor.extract(undefined, 'id');
      expect(key).toBeUndefined();
    });

    it('should handle rows with zero as a value', () => {
      const row = { id: 0, name: 'Test' };
      const key = RowKeyExtractor.extract(row, 'id');
      expect(key).toBe(0);
    });

    it('should handle rows with empty string as a value', () => {
      const row = { id: '', name: 'Test' };
      const key = RowKeyExtractor.extract(row, 'id');
      expect(key).toBe('');
    });

    it('should handle rows with false as a value', () => {
      const row = { id: false, name: 'Test' };
      const key = RowKeyExtractor.extract(row, 'id');
      expect(key).toBe(false);
    });

    it('should handle nested objects', () => {
      const row = { user: { id: 123 }, name: 'Test' };
      const key = RowKeyExtractor.extract(row, 'user');
      expect(key).toEqual({ id: 123 });
    });
  });

  describe('extractOrDefault', () => {
    it('should extract the key value when it exists', () => {
      const row = { id: 123, name: 'Test' };
      const result = RowKeyExtractor.extractOrDefault(row, 'id');
      expect(result).toBe(123);
    });

    it('should return the row itself if the key does not exist', () => {
      const row = { id: 123, name: 'Test' };
      const result = RowKeyExtractor.extractOrDefault(row, 'nonexistent');
      expect(result).toBe(row);
    });

    it('should return the row for null input', () => {
      const result = RowKeyExtractor.extractOrDefault(null, 'id');
      expect(result).toBeNull();
    });

    it('should return the row for undefined input', () => {
      const result = RowKeyExtractor.extractOrDefault(undefined, 'id');
      expect(result).toBeUndefined();
    });

    it('should extract zero value correctly', () => {
      const row = { id: 0, name: 'Test' };
      const result = RowKeyExtractor.extractOrDefault(row, 'id');
      expect(result).toBe(0);
    });

    it('should handle complex object types', () => {
      interface User {
        id: number;
        name: string;
      }
      const user: User = { id: 456, name: 'John' };
      const result = RowKeyExtractor.extractOrDefault(user, 'id');
      expect(result).toBe(456);
    });
  });
});
