import { describe, it, expect } from 'vitest';
import { add } from './math';

describe('add function', () => {
  it('should correctly add two positive numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  it('should correctly handle negative numbers', () => {
    expect(add(-1, 1)).toBe(0);
    expect(add(-1, -1)).toBe(-2);
  });

  it('should return the same number when adding zero', () => {
    expect(add(5, 0)).toBe(5);
    expect(add(0, 5)).toBe(5);
  });
});
