/**
 * Utility for extracting row keys from data objects with type safety
 * Follows Angular conventions and TypeScript best practices
 */
export class RowKeyExtractor {
  /**
   * Extract a key value from a row object in a type-safe manner
   * @param row The row object (must not be null/undefined)
   * @param keyField The field name to extract
   * @returns The key value or undefined if not found
   * @example
   * const row = { id: 123, name: 'Test' };
   * const key = RowKeyExtractor.extract(row, 'id'); // Returns 123
   */
  static extract<T>(
    row: T | null | undefined,
    keyField: string
  ): string | number | undefined {
    if (row == null || typeof row !== 'object') {
      return undefined;
    }
    const obj = row as Record<string, unknown>;
    return keyField in obj ? (obj[keyField] as string | number) : undefined;
  }

  /**
   * Extract a key value from a row object or return the row itself as fallback
   * @param row The row object
   * @param keyField The field name to extract
   * @returns The key value or the row object itself
   * @example
   * const row = { id: 123, name: 'Test' };
   * const key = RowKeyExtractor.extractOrDefault(row, 'id'); // Returns 123
   * const key2 = RowKeyExtractor.extractOrDefault(row, 'missing'); // Returns row
   */
  static extractOrDefault<T>(row: T, keyField: string): string | number | T {
    if (row == null) {
      return row;
    }
    const extracted = this.extract(row, keyField);
    return extracted !== undefined ? extracted : row;
  }
}
