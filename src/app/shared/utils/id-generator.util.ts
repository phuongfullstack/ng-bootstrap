/**
 * Utility for generating unique IDs for components
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
   * Reset the counter for a specific prefix (mainly for testing)
   */
  static reset(prefix?: string): void {
    if (prefix) {
      this.counters.delete(prefix);
    } else {
      this.counters.clear();
    }
  }
}
