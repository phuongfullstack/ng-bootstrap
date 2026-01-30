/**
 * Utility for extracting row keys from data objects
 */
export class RowKeyExtractor {
  /**
   * Extract a key value from a row object
   * @param row The row object
   * @param keyField The field name to extract
   * @returns The key value or undefined if not found
   */
  static extract<T>(row: T, keyField: string): string | number | undefined {
    const anyRow = row as any;
    return anyRow && keyField in anyRow ? anyRow[keyField] : undefined;
  }

  /**
   * Extract a key value from a row object or return the row itself as fallback
   * @param row The row object
   * @param keyField The field name to extract
   * @returns The key value or the row object itself
   */
  static extractOrDefault<T>(row: T, keyField: string): string | number | T {
    return this.extract(row, keyField) ?? row;
  }
}
