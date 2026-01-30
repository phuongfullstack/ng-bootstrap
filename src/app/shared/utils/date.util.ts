/**
 * Utility functions for common date operations
 */
export class DateUtils {
  /**
   * Generate a unique key for a date (year-month-day)
   * @param date The date to generate a key for
   * @returns A string key in format: 'YYYY-M-D'
   */
  static dateKey(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }

  /**
   * Check if two dates represent the same day
   * @param date1 First date
   * @param date2 Second date
   * @returns true if both dates are on the same day
   */
  static isSameDate(date1: Date, date2: Date): boolean {
    return this.dateKey(date1) === this.dateKey(date2);
  }

  /**
   * Check if a date falls on a weekend
   * @param date The date to check
   * @returns true if the date is Saturday or Sunday
   */
  static isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6;
  }

  /**
   * Normalize a date input to a Date object
   * @param date Date or string input
   * @returns A Date object or null if invalid
   */
  static normalizeDate(date: Date | string): Date | null {
    const d = new Date(date);
    return !Number.isNaN(d.getTime()) ? d : null;
  }

  /**
   * Get the first day of the month for a given date
   * @param date The date to get the first day for
   * @returns A new Date object representing the first day of the month
   */
  static getFirstDayOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  /**
   * Strip time components from a date, keeping only year, month, and day
   * @param date The date to normalize
   * @returns A new Date object with time set to 00:00:00
   */
  static stripTime(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
}
