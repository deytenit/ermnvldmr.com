import { merge } from './merge';

/**
 * Test suite for the merge utility function.
 */
describe('shared/helpers/object/merge', () => {
  it('deeply merges two objects, preserving source values by default', () => {
    const source = { a: 1, b: { c: 2 } };
    const target = { a: 3, b: { c: 4, d: 5 }, e: 6 };
    const result = merge(source, target);

    expect(result).toEqual({
      a: 1, // force is false, so 1 is preserved
      b: {
        c: 2, // force is false, so 2 is preserved
        d: 5, // added because it was not in source
      },
      e: 6, // added because it was not in source
    });
  });

  it('deeply merges two objects and overrides values when force is true', () => {
    const source = { a: 1, b: { c: 2 } };
    const target = { a: 3, b: { c: 4, d: 5 }, e: 6 };
    const result = merge(source, target, { force: true });

    expect(result).toEqual({
      a: 3,
      b: {
        c: 4,
        d: 5,
      },
      e: 6,
    });
  });

  it('concatenates arrays when both are present at the same key', () => {
    const source = { a: [1, 2] };
    const target = { a: [3, 4] };
    const result = merge(source, target);

    expect(result).toEqual({ a: [1, 2, 3, 4] });
  });

  it('handles primitive values at the root', () => {
    expect(merge(1, 2)).toBe(1);
    expect(merge(1, 2, { force: true })).toBe(2);
  });

  it('handles mixed types between source and target', () => {
    const source = { a: { b: 1 } };
    const target = { a: [1, 2] };

    // Source wins because force is false
    expect(merge(source, target)).toEqual({ a: { b: 1 } });

    // Target wins because force is true
    expect(merge(source, target, { force: true })).toEqual({ a: [1, 2] });
  });

  it('handles deep recursion with arrays and objects', () => {
    const source = {
      users: [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
      ],
      config: {
        retries: 3,
        enabled: true,
      },
    };

    const target = {
      users: [{ id: 3, name: 'Doe' }],
      config: {
        retries: 5,
        timeout: 1000,
      },
    };

    const result = merge(source, target);

    expect(result).toEqual({
      users: [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 3, name: 'Doe' },
      ],
      config: {
        retries: 3,
        enabled: true,
        timeout: 1000,
      },
    });
  });

  it('preserves the source when target has undefined values', () => {
    const source = { a: 1 };
    const target = { a: undefined };
    expect(merge(source, target)).toEqual({ a: 1 });
  });

  it('replaces undefined source with target', () => {
    const source = { a: undefined };
    const target = { a: 1 };
    expect(merge(source, target)).toEqual({ a: 1 });
  });
});
