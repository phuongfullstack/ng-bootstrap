import { describe, it, expect } from 'vitest';
import { DateUtils } from './date.util';

describe('DateUtils', () => {
  describe('dateKey', () => {
    it('should generate a unique key for a date', () => {
      const date = new Date(2024, 0, 15); // Jan 15, 2024
      const key = DateUtils.dateKey(date);
      expect(key).toBe('2024-0-15');
    });

    it('should generate the same key for dates on the same day', () => {
      const date1 = new Date(2024, 0, 15, 10, 30);
      const date2 = new Date(2024, 0, 15, 18, 45);
      expect(DateUtils.dateKey(date1)).toBe(DateUtils.dateKey(date2));
    });

    it('should generate different keys for different dates', () => {
      const date1 = new Date(2024, 0, 15);
      const date2 = new Date(2024, 0, 16);
      expect(DateUtils.dateKey(date1)).not.toBe(DateUtils.dateKey(date2));
    });
  });

  describe('isSameDate', () => {
    it('should return true for dates on the same day', () => {
      const date1 = new Date(2024, 0, 15, 10, 30);
      const date2 = new Date(2024, 0, 15, 18, 45);
      expect(DateUtils.isSameDate(date1, date2)).toBe(true);
    });

    it('should return false for dates on different days', () => {
      const date1 = new Date(2024, 0, 15);
      const date2 = new Date(2024, 0, 16);
      expect(DateUtils.isSameDate(date1, date2)).toBe(false);
    });

    it('should return false for dates in different months', () => {
      const date1 = new Date(2024, 0, 15);
      const date2 = new Date(2024, 1, 15);
      expect(DateUtils.isSameDate(date1, date2)).toBe(false);
    });

    it('should return false for dates in different years', () => {
      const date1 = new Date(2024, 0, 15);
      const date2 = new Date(2023, 0, 15);
      expect(DateUtils.isSameDate(date1, date2)).toBe(false);
    });
  });

  describe('isWeekend', () => {
    it('should return true for Saturday', () => {
      const saturday = new Date(2024, 0, 6); // Jan 6, 2024 is a Saturday
      expect(DateUtils.isWeekend(saturday)).toBe(true);
    });

    it('should return true for Sunday', () => {
      const sunday = new Date(2024, 0, 7); // Jan 7, 2024 is a Sunday
      expect(DateUtils.isWeekend(sunday)).toBe(true);
    });

    it('should return false for weekdays', () => {
      const monday = new Date(2024, 0, 8); // Jan 8, 2024 is a Monday
      const tuesday = new Date(2024, 0, 9);
      const wednesday = new Date(2024, 0, 10);
      const thursday = new Date(2024, 0, 11);
      const friday = new Date(2024, 0, 12);

      expect(DateUtils.isWeekend(monday)).toBe(false);
      expect(DateUtils.isWeekend(tuesday)).toBe(false);
      expect(DateUtils.isWeekend(wednesday)).toBe(false);
      expect(DateUtils.isWeekend(thursday)).toBe(false);
      expect(DateUtils.isWeekend(friday)).toBe(false);
    });
  });

  describe('normalizeDate', () => {
    it('should convert a valid date string to a Date object', () => {
      const result = DateUtils.normalizeDate('2024-01-15');
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2024);
    });

    it('should return the Date object as-is for a valid Date input', () => {
      const date = new Date(2024, 0, 15);
      const result = DateUtils.normalizeDate(date);
      expect(result).toBeInstanceOf(Date);
    });

    it('should return null for invalid date strings', () => {
      const result = DateUtils.normalizeDate('invalid-date');
      expect(result).toBeNull();
    });

    it('should return null for empty string', () => {
      const result = DateUtils.normalizeDate('');
      expect(result).toBeNull();
    });
  });

  describe('getFirstDayOfMonth', () => {
    it('should return the first day of the month', () => {
      const date = new Date(2024, 0, 15);
      const firstDay = DateUtils.getFirstDayOfMonth(date);
      expect(firstDay.getDate()).toBe(1);
      expect(firstDay.getMonth()).toBe(0);
      expect(firstDay.getFullYear()).toBe(2024);
    });

    it('should work for the last day of the month', () => {
      const date = new Date(2024, 0, 31);
      const firstDay = DateUtils.getFirstDayOfMonth(date);
      expect(firstDay.getDate()).toBe(1);
      expect(firstDay.getMonth()).toBe(0);
    });

    it('should work for the first day of the month', () => {
      const date = new Date(2024, 0, 1);
      const firstDay = DateUtils.getFirstDayOfMonth(date);
      expect(firstDay.getDate()).toBe(1);
      expect(firstDay.getMonth()).toBe(0);
    });
  });

  describe('stripTime', () => {
    it('should remove time components from a date', () => {
      const date = new Date(2024, 0, 15, 14, 30, 45, 123);
      const stripped = DateUtils.stripTime(date);
      expect(stripped.getFullYear()).toBe(2024);
      expect(stripped.getMonth()).toBe(0);
      expect(stripped.getDate()).toBe(15);
      expect(stripped.getHours()).toBe(0);
      expect(stripped.getMinutes()).toBe(0);
      expect(stripped.getSeconds()).toBe(0);
      expect(stripped.getMilliseconds()).toBe(0);
    });

    it('should not modify the original date', () => {
      const date = new Date(2024, 0, 15, 14, 30);
      const stripped = DateUtils.stripTime(date);
      expect(date.getHours()).toBe(14);
      expect(stripped.getHours()).toBe(0);
    });
  });
});
