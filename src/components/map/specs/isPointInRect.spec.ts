import { describe, expect, it } from 'vitest';

import isPointInRect from '../isPointInRect';

describe('isPointInRect', () => {
  const rect = { x: 10, y: 20, width: 30, height: 40 };

  it('should return true for point inside the rectangle', () => {
    // given
    const point = { x: 25, y: 35 };

    // when
    const result = isPointInRect({ point, rect });

    // then
    expect(result).toBe(true);
  });

  it('should return true for point on the left edge', () => {
    // given
    const point = { x: 10, y: 30 };

    // when
    const result = isPointInRect({ point, rect });

    // then
    expect(result).toBe(true);
  });

  it('should return true for point on the right edge', () => {
    // given
    const point = { x: 40, y: 30 };

    // when
    const result = isPointInRect({ point, rect });

    // then
    expect(result).toBe(true);
  });

  it('should return true for point on the top edge', () => {
    // given
    const point = { x: 25, y: 20 };

    // when
    const result = isPointInRect({ point, rect });

    // then
    expect(result).toBe(true);
  });

  it('should return true for point on the bottom edge', () => {
    // given
    const point = { x: 25, y: 60 };

    // when
    const result = isPointInRect({ point, rect });

    // then
    expect(result).toBe(true);
  });

  it('should return true for point at the top-left corner', () => {
    // given
    const point = { x: 10, y: 20 };

    // when
    const result = isPointInRect({ point, rect });

    // then
    expect(result).toBe(true);
  });

  it('should return true for point at the bottom-right corner', () => {
    // given
    const point = { x: 40, y: 60 };

    // when
    const result = isPointInRect({ point, rect });

    // then
    expect(result).toBe(true);
  });

  it('should return false for point outside to the left', () => {
    // given
    const point = { x: 5, y: 30 };

    // when
    const result = isPointInRect({ point, rect });

    // then
    expect(result).toBe(false);
  });

  it('should return false for point outside to the right', () => {
    // given
    const point = { x: 45, y: 30 };

    // when
    const result = isPointInRect({ point, rect });

    // then
    expect(result).toBe(false);
  });

  it('should return false for point outside above', () => {
    // given
    const point = { x: 25, y: 15 };

    // when
    const result = isPointInRect({ point, rect });

    // then
    expect(result).toBe(false);
  });

  it('should return false for point outside below', () => {
    // given
    const point = { x: 25, y: 65 };

    // when
    const result = isPointInRect({ point, rect });

    // then
    expect(result).toBe(false);
  });

  it('should return false for point at top-left corner outside', () => {
    // given
    const point = { x: 9, y: 19 };

    // when
    const result = isPointInRect({ point, rect });

    // then
    expect(result).toBe(false);
  });

  it('should return false for point at bottom-right corner outside', () => {
    // given
    const point = { x: 41, y: 61 };

    // when
    const result = isPointInRect({ point, rect });

    // then
    expect(result).toBe(false);
  });
});
