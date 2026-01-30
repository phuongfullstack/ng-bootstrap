import { describe, it, expect, beforeEach } from 'vitest';
import { IdGenerator } from './id-generator.util';

describe('IdGenerator', () => {
  beforeEach(() => {
    IdGenerator.reset();
  });

  describe('generate', () => {
    it('should generate sequential IDs with the same prefix', () => {
      const id1 = IdGenerator.generate('test');
      const id2 = IdGenerator.generate('test');
      const id3 = IdGenerator.generate('test');

      expect(id1).toBe('test-1');
      expect(id2).toBe('test-2');
      expect(id3).toBe('test-3');
    });

    it('should maintain separate counters for different prefixes', () => {
      const buttonId1 = IdGenerator.generate('button');
      const inputId1 = IdGenerator.generate('input');
      const buttonId2 = IdGenerator.generate('button');
      const inputId2 = IdGenerator.generate('input');

      expect(buttonId1).toBe('button-1');
      expect(inputId1).toBe('input-1');
      expect(buttonId2).toBe('button-2');
      expect(inputId2).toBe('input-2');
    });

    it('should handle empty prefix', () => {
      const id = IdGenerator.generate('');
      expect(id).toBe('-1');
    });

    it('should handle special characters in prefix', () => {
      const id = IdGenerator.generate('my-component-123');
      expect(id).toBe('my-component-123-1');
    });
  });

  describe('reset', () => {
    it('should reset a specific prefix counter', () => {
      IdGenerator.generate('test');
      IdGenerator.generate('test');
      IdGenerator.reset('test');

      const newId = IdGenerator.generate('test');
      expect(newId).toBe('test-1');
    });

    it('should reset all counters when no prefix is provided', () => {
      IdGenerator.generate('button');
      IdGenerator.generate('input');
      IdGenerator.generate('button');

      IdGenerator.reset();

      expect(IdGenerator.generate('button')).toBe('button-1');
      expect(IdGenerator.generate('input')).toBe('input-1');
    });

    it('should not affect other prefixes when resetting a specific one', () => {
      IdGenerator.generate('button');
      IdGenerator.generate('input');
      IdGenerator.generate('button');

      IdGenerator.reset('button');

      expect(IdGenerator.generate('button')).toBe('button-1');
      expect(IdGenerator.generate('input')).toBe('input-2');
    });

    it('should handle resetting a prefix that does not exist', () => {
      expect(() => IdGenerator.reset('nonexistent')).not.toThrow();
    });
  });
});
