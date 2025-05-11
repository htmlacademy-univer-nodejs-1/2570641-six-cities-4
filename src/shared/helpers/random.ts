/**
 * Helper functions for generating random data
 */

/**
 * Get random integer in range (min, max)
 */
export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Get random item from array
 */
export function getRandomItem<T>(items: T[]): T {
  return items[getRandomInt(0, items.length)];
}

/**
 * Get random items from array
 */
export function getRandomItems<T>(items: T[], count: number): T[] {
  const result: T[] = [];
  const copy = [...items];

  for (let i = 0; i < count && copy.length > 0; i++) {
    const randomIndex = getRandomInt(0, copy.length);
    result.push(copy[randomIndex]);
    copy.splice(randomIndex, 1);
  }

  return result;
}

/**
 * Get random boolean with given probability
 */
export function getRandomBoolean(probability = 0.5): boolean {
  return Math.random() < probability;
}

/**
 * Get random float in range (min, max) with given precision
 */
export function getRandomFloat(min: number, max: number, precision = 1): number {
  const value = Math.random() * (max - min) + min;
  return Number(value.toFixed(precision));
}

/**
 * Get random date in range (from, to)
 */
export function getRandomDate(from: Date, to: Date): Date {
  const fromTime = from.getTime();
  const toTime = to.getTime();
  return new Date(getRandomInt(fromTime, toTime));
}
