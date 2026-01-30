/**
 * Utility for generating unique IDs for components
 * 
 * Note: This utility maintains global state across all component instances.
 * For test isolation, call IdGenerator.reset() in beforeEach/afterEach hooks.
 */
export class IdGenerator {
  private static counters = new Map<string, number>();

  /**
   * Generate a unique ID with the given prefix
   * @param prefix The prefix for the ID (e.g., 'core-button', 'core-input')
   * @returns A unique ID string in format: `${prefix}-${count}`
   */
  static generate(prefix: string): string {
    const count = (this.counters.get(prefix) ?? 0) + 1;
    this.counters.set(prefix, count);
    return `${prefix}-${count}`;
  }

  /**
   * Reset the counter for a specific prefix or all prefixes
   * @param prefix Optional prefix to reset. If not provided, resets all counters
   */
  static reset(prefix?: string): void {
    if (prefix) {
      this.counters.delete(prefix);
    } else {
      this.counters.clear();
    }
  }
}
